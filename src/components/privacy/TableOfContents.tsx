import React from "react";
import { List } from "lucide-react";

const sections = [
  { id: "data-collection", label: "Data Collection" },
  { id: "data-usage", label: "How We Use Your Data" },
  { id: "data-sharing", label: "Data Sharing" },
  { id: "user-rights", label: "Your Rights" },
  { id: "security", label: "Security Measures" },
  { id: "cookies", label: "Cookie Policy" },
  { id: "contact", label: "Contact Us" },
];

export function TableOfContents() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-xs sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-accent" />
        <h2 className="font-medium text-primary">Contents</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="block py-2 px-3 text-sm text-primary/70 hover:bg-background 
                         rounded-lg transition-colors hover:text-primary"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
