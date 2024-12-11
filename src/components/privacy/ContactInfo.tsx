import React from "react";
import { Mail } from "lucide-react";
import { Section } from "./Section";

export function ContactInfo() {
  return (
    <Section id="contact" icon={Mail} title="Contact Us">
      <p className="text-primary/80 mb-6">
        If you have any questions about our Privacy Policy, please contact us:
      </p>
      <div className="bg-background rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-primary mb-2">
              Data Protection Officer
            </h3>
            <p className="text-primary/70">privacy@drinkgenie.app</p>
          </div>

          <div className="pt-4 border-t border-primary/10">
            <p className="text-sm text-primary/60">
              We aim to respond to all inquiries within 48 hours during business
              days.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
