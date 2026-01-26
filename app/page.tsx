"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Redirect to the main HeftCoder app
    window.location.href = "https://heftcoder.icu";
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Redirecting to HeftCoder...</p>
      </div>
    </div>
  );
}
