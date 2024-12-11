import React from "react";

interface PageHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function PageHeader({ icon, title, description }: PageHeaderProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any  */}
        {React.cloneElement(icon as any, {
          className: "h-6 w-6 text-accent",
        })}
      </div>
      <h1 className="text-4xl font-display text-primary mb-3">{title}</h1>
      <p className="text-primary/60">{description}</p>
    </div>
  );
}
