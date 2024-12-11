import React from "react";
import { Share2 } from "lucide-react";
import { Section } from "./Section";

export function DataSharing() {
  return (
    <Section id="data-sharing" icon={Share2} title="Data Sharing">
      <p className="text-primary/80 mb-6">
        We take your privacy seriously and limit data sharing to:
      </p>
      <div className="space-y-6">
        {[
          {
            title: "Service Providers",
            description:
              "Trusted partners who assist in providing our services (e.g., hosting, analytics)",
            items: [
              "Cloud storage providers",
              "Payment processors",
              "Analytics services",
            ],
          },
          {
            title: "Legal Requirements",
            description: "When required by law or to protect our rights",
            items: ["Court orders", "Legal obligations", "Fraud prevention"],
          },
          {
            title: "Business Transfers",
            description:
              "In connection with a merger, acquisition, or sale of assets",
            items: ["Due diligence", "Asset transfer", "Service continuity"],
          },
        ].map((section, index) => (
          <div key={index} className="border border-primary/10 rounded-xl p-6">
            <h3 className="text-lg font-medium text-primary mb-2">
              {section.title}
            </h3>
            <p className="text-primary/70 mb-4">{section.description}</p>
            <ul className="grid gap-2">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-primary/60"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
