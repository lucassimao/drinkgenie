"use client";

import { GlassWater, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function MainContent() {
  const searchParams = useSearchParams();
  const credits = searchParams.get("credits");

  return (
    <>
      {/* Main Content */}
      <h1 className="text-3xl font-display text-primary mb-4">
        Payment Successful!
      </h1>
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-warning" />
        <p className="text-lg text-primary/80">
          {credits} magical credits added to your account
        </p>
        <Sparkles className="h-5 w-5 text-warning" />
      </div>

      {/* Credits Display */}
      <div className="bg-background rounded-xl p-6 mb-8">
        <div className="flex items-center justify-center gap-3">
          <GlassWater className="h-6 w-6 text-accent" />
          <span className="text-2xl font-bold text-primary">
            {credits} Credits
          </span>
        </div>
        <p className="text-primary/60 mt-2">
          Ready to create amazing cocktails
        </p>
      </div>
    </>
  );
}
