import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { supabase } from "../lib/supabase";
import { SEO } from "../components/SEO";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const finalize = async () => {
      try {
        // Google OAuth returns ?code=... (PKCE). We must exchange it for a session.
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;

        if (session?.user) {
          navigate("/dashboard", { replace: true });
          return;
        }

        navigate("/auth", { replace: true });
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || "Authentication failed");
      }
    };

    finalize();
    return () => {
      cancelled = true;
    };
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <SEO
        title="Signing you in"
        description="Completing sign-in."
        url="/auth/callback"
        noindex={true}
      />

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h1 className="text-lg font-semibold">Completing sign-in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Please wait while we finish authentication.
        </p>

        {!error ? (
          <div className="mt-6 flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Exchanging authorization code…</span>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <button
              type="button"
              className="mt-3 text-sm font-medium text-primary underline underline-offset-4"
              onClick={() => navigate("/auth", { replace: true })}
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
