"use server";

import { createServiceClient } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUserWithSupabase() {
    const user = await currentUser();
    if (!user) return null;

    const supabase = createServiceClient();

    // Debug: log the table structure or at least the fetch attempt
    console.log(`Syncing user: ${user.id}`);

    // 1. Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', user.id)
        .single();

    if (fetchError) {
        console.error('Fetch error in syncUserWithSupabase:', fetchError);
        if (fetchError.code !== 'PGRST116') return { error: fetchError.message };
    }

    if (!existingUser) {
        // 2. Create new user with 2,500 credits
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
                clerk_id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                image: user.imageUrl,
                credits: 2500,
                referral_code: Math.random().toString(36).substring(7).toUpperCase(),
                subscription_tier: 'free'
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating user in Supabase:', insertError);
            return null;
        }
        return newUser;
    }

    // 3. Top-up logic (if free and < 2500)
    if (existingUser.subscription_tier === 'free' && (existingUser.credits || 0) < 2500) {
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ credits: 2500 })
            .eq('id', existingUser.id)
            .select()
            .single();

        if (updateError) {
            console.error('Error topping up credits:', updateError);
            return existingUser;
        }
        return updatedUser;
    }

    return existingUser;
}
