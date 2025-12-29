"use server";

import { createServiceClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { AIEngine, ModelID } from "@/lib/ai/engine";

export async function generateCodeInSupabase({
    projectId,
    prompt,
    currentFileStructure,
    model
}: {
    projectId: string;
    prompt: string;
    currentFileStructure: any;
    model: string;
}) {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const supabase = createServiceClient();

    // 1. Get user and check credits
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

    if (userError || !user) throw new Error("User not found");

    const isImage = model === "flux.2-pro";
    const cost = isImage ? 50 : 5;

    if ((user.credits || 0) < cost) {
        throw new Error(`Insufficient credits (Need ${cost}, you have ${user.credits || 0})`);
    }

    // 2. Call AI Engine
    const result = await AIEngine.generate(model as ModelID, prompt, currentFileStructure);

    let content;
    let imageUrl;

    if (isImage) {
        const parsed = JSON.parse(result.content);
        imageUrl = parsed.url;
        // For images, we create a file entry
        const fileName = `public/assets/gen-${Date.now()}.png`;
        content = { [fileName]: `IMAGE_ASSET:${imageUrl}` };
    } else {
        try {
            content = JSON.parse(result.content);
        } catch (e) {
            console.error("Failed to parse AI response:", result.content);
            throw new Error("AI returned invalid JSON");
        }
    }

    // 3. Apply changes and deduct credits (Atomic-ish)
    // Fetch latest project state
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('files')
        .eq('id', projectId)
        .single();

    if (projectError || !project) throw new Error("Project not found");

    const updatedFiles = { ...(project.files as object), ...(content as object) };

    // Update project
    const { error: updateProjectError } = await supabase
        .from('projects')
        .update({
            files: updatedFiles,
            last_modified: Date.now()
        })
        .eq('id', projectId);

    if (updateProjectError) throw new Error("Failed to update project");

    // Update credits
    const { error: updateCreditsError } = await supabase
        .from('users')
        .update({ credits: Math.max(0, (user.credits || 0) - cost) })
        .eq('id', user.id);

    if (updateCreditsError) {
        console.error("Credit deduction failed! User might have received free generation:", user.id);
    }

    return { success: true, imageUrl };
}
