import React from "react";
import { Lock } from "lucide-react";
import { Section } from "./Section";

export function SecurityMeasures() {
  return (
    <Section id="security" icon={Lock} title="Security Measures">
      <p className="text-primary/80 mb-6">
        We implement appropriate technical and organizational measures to
        protect your data:
      </p>
      <div className="grid gap-6">
        {[
          {
            title: "Data Encryption",
            measures: [
              "SSL/TLS encryption for data in transit",
              "AES-256 encryption for stored data",
              "Secure key management",
            ],
          },
          {
            title: "Access Controls",
            measures: [
              "Role-based access control",
              "Two-factor authentication",
              "Regular access reviews",
            ],
          },
          {
            title: "Monitoring & Auditing",
            measures: [
              "Real-time security monitoring",
              "Regular security audits",
              "Incident response procedures",
            ],
          },
        ].map((section, index) => (
          <div
            key={index}
            className="border border-primary/10 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-background border-b border-primary/10">
              <h3 className="font-medium text-primary">{section.title}</h3>
            </div>
            <ul className="p-6 space-y-3">
              {section.measures.map((measure, i) => (
                <li key={i} className="flex items-center gap-3 text-primary/70">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {measure}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
