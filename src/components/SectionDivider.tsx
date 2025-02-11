import { Wand2 } from "lucide-react";

interface SectionDividerProps {
  title: string;
  subtitle?: string;
}

export function SectionDivider({ title, subtitle }: SectionDividerProps) {
  return (
    <div className="text-center pb-16">
      {/* Gradient Badge */}
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r 
                 from-warning/20 to-accent/20 backdrop-blur-sm mb-6"
      >
        <Wand2 className="h-4 w-4 text-warning" />
        <span
          className="text-sm font-medium bg-gradient-to-r from-warning to-accent 
                   bg-clip-text text-transparent"
        >
          Free Recipes
        </span>
      </div>

      {/* Title with Gradient */}
      <h2 className="text-4xl md:text-5xl font-display text-primary mb-4">
        {title}
        <span
          className="block text-transparent bg-clip-text bg-gradient-to-r 
                   from-warning to-accent mt-2 pb-5"
        >
          For Everyone
        </span>
      </h2>

      {subtitle && (
        <p className="text-xl text-primary/60 max-w-2xl mx-auto p-0">
          {subtitle}
        </p>
      )}
    </div>
  );
}
