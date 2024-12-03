import React from "react";
import { Sparkles } from "lucide-react";

interface SectionDividerProps {
  title: string;
  subtitle?: string;
}

export function SectionDivider({ title, subtitle }: SectionDividerProps) {
  return (
    <div className="relative pb-12">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-primary/10" />
      </div>
      <div className="relative flex justify-center">
        <div className="bg-background px-6 flex flex-col items-center">
          <div className="bg-white shadow-md rounded-full p-3 mb-3">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-2xl font-display text-primary">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-primary/60">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
