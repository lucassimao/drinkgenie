import React from "react";
import { Grid, List } from "lucide-react";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-primary/20 p-1">
      <button
        onClick={() => onViewChange("grid")}
        className={`p-2 rounded ${
          view === "grid"
            ? "bg-accent text-white"
            : "text-primary/60 hover:bg-primary/5"
        }`}
      >
        <Grid className="h-5 w-5" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-2 rounded ${
          view === "list"
            ? "bg-accent text-white"
            : "text-primary/60 hover:bg-primary/5"
        }`}
      >
        <List className="h-5 w-5" />
      </button>
    </div>
  );
}
