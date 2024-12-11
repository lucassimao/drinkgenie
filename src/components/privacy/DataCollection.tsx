import React from "react";
import { FileText } from "lucide-react";
import { Section } from "./Section";

export function DataCollection() {
  return (
    <Section id="data-collection" icon={FileText} title="Data Collection">
      <p className="text-primary/80 mb-4">
        We collect information that you provide directly to us when using
        DrinkGenie:
      </p>
      <ul className="space-y-3">
        {[
          "Account information (name, email, profile picture)",
          "User preferences and favorite cocktails",
          "Custom cocktail recipes and modifications",
          "Usage data and interaction with our services",
          "Device and browser information",
        ].map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-accent mt-2" />
            <span className="text-primary/70">{item}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
