import React from "react";
import { Cookie } from "lucide-react";
import { Section } from "./Section";

export function CookiePolicy() {
  return (
    <Section id="cookies" icon={Cookie} title="Cookie Policy">
      <p className="text-primary/80 mb-6">
        We use cookies and similar technologies to enhance your experience:
      </p>
      <div className="space-y-6">
        {[
          {
            type: "Essential Cookies",
            description: "Required for basic site functionality",
            examples: ["Authentication", "Security", "User preferences"],
          },
          {
            type: "Analytics Cookies",
            description:
              "Help us understand how users interact with our service",
            examples: ["Page views", "Feature usage", "Error tracking"],
          },
          {
            type: "Marketing Cookies",
            description: "Used for personalized content and advertisements",
            examples: [
              "Ad targeting",
              "Social media integration",
              "Campaign tracking",
            ],
          },
        ].map((cookie, index) => (
          <div key={index} className="bg-background rounded-xl p-6">
            <h3 className="text-lg font-medium text-primary mb-2">
              {cookie.type}
            </h3>
            <p className="text-primary/70 mb-4">{cookie.description}</p>
            <div className="flex flex-wrap gap-2">
              {cookie.examples.map((example, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white rounded-full text-sm text-primary/60"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
