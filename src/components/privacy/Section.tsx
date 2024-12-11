import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface SectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export function Section({ id, icon: Icon, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-2xl font-display text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}
