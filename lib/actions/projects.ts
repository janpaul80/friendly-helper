"use server";

import { createServiceClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { syncUserWithSupabase } from "./auth";

export async function createProjectInSupabase(name: string) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const supabase = createServiceClient();

    // 1. Get user and check credits (auto-sync if missing)
    let { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

    if (userError || !user) {
        console.log("User not found in Supabase on project creation, syncing...");
        user = await syncUserWithSupabase();
        if (!user) throw new Error("Failed to sync user data. Please refresh and try again.");
    }

    const currentCredits = user.credits || 0;
    if (currentCredits < 100) {
        throw new Error(`Insufficient credits (100 required, you have ${currentCredits})`);
    }

    // 2. Deduct credits
    const { error: updateError } = await supabase
        .from('users')
        .update({ credits: currentCredits - 100 })
        .eq('id', user.id);

    if (updateError) throw new Error("Failed to deduct credits");

    // 3. Generate slug & unique subdomain
    const slug = (name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "project");

    let finalSubdomain = slug;
    let counter = 1;

    while (true) {
        const { data: existing } = await supabase
            .from('projects')
            .select('id')
            .eq('subdomain', finalSubdomain)
            .single();

        if (!existing) break;
        finalSubdomain = `${slug}-${counter}`;
        counter++;
    }

    // 4. Create project
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            name,
            subdomain: finalSubdomain,
            last_modified: Date.now(),
            files: {
                "App.tsx": `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">\n      <h1 className="text-4xl font-bold text-blue-600 mb-4">Hello ${name}!</h1>\n      <p className="text-gray-600">Your new project is ready to be built.</p>\n    </div>\n  );\n}\n`,
            }
        })
        .select()
        .single();

    if (projectError) {
        // Rollback credit deduction? (Optional for now)
        throw new Error("Failed to create project");
    }

    return project;
}
