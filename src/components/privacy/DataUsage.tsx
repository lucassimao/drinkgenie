import React from "react";
import { Settings } from "lucide-react";
import { Section } from "./Section";

export function DataUsage() {
  return (
    <Section id="data-usage" icon={Settings} title="How We Use Your Data">
      <p className="text-primary/80 mb-4">
        Your data helps us provide and improve DrinkGenie&apos;s services:
      </p>
      <div className="grid gap-4">
        {[
          {
            title: "Personalization",
            description:
              "Customize your cocktail recommendations and experience",
          },
          {
            title: "Service Improvement",
            description:
              "Analyze usage patterns to enhance our AI algorithms and features",
          },
          {
            title: "Communication",
            description:
              "Send important updates and promotional content (with your consent)",
          },
          {
            title: "Support",
            description: "Provide customer service and technical assistance",
          },
        ].map((item, index) => (
          <div key={index} className="p-4 bg-background rounded-lg">
            <h3 className="font-medium text-primary mb-1">{item.title}</h3>
            <p className="text-sm text-primary/70">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
