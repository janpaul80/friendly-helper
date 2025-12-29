"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { syncUserWithSupabase } from "@/lib/actions/auth";

export function SyncUser() {
    const { user, isLoaded } = useUser();
    const [synced, setSynced] = useState(false);

    useEffect(() => {
        if (!isLoaded || !user || synced) return;

        const sync = async () => {
            try {
                const syncedUser = await syncUserWithSupabase();
                if (syncedUser) {
                    console.log('User synced with Supabase');
                    setSynced(true);
                }
            } catch (err) {
                console.error('Unexpected error during Supabase sync:', err);
            }
        };

        sync();
    }, [user, isLoaded, synced]);

    return null;
}
