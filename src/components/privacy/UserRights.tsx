import React from "react";
import { UserCheck } from "lucide-react";
import { Section } from "./Section";

export function UserRights() {
  return (
    <Section id="user-rights" icon={UserCheck} title="Your Rights">
      <p className="text-primary/80 mb-6">
        You have several rights regarding your personal data:
      </p>
      <div className="grid gap-4">
        {[
          {
            right: "Access",
            description: "Request a copy of your personal data",
          },
          {
            right: "Rectification",
            description: "Correct inaccurate or incomplete data",
          },
          {
            right: "Erasure",
            description: "Request deletion of your personal data",
          },
          {
            right: "Portability",
            description: "Receive your data in a structured format",
          },
          {
            right: "Objection",
            description: "Object to processing of your data",
          },
          {
            right: "Restriction",
            description: "Limit how we use your data",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-background rounded-lg"
          >
            <div className="px-3 py-1 bg-accent/10 rounded-full text-sm font-medium text-accent">
              {item.right}
            </div>
            <p className="text-primary/70">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
