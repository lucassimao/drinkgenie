import React, { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

interface FilterSection {
  title: string;
  options: { value: string; label: string }[];
}

const FILTERS: Record<string, FilterSection> = {
  alcoholContent: {
    title: "Alcohol Content",
    options: [
      { value: "non-alcoholic", label: "Non-Alcoholic" },
      { value: "light", label: "Light (0-10%)" },
      { value: "medium", label: "Medium (10-20%)" },
      { value: "strong", label: "Strong (20%+)" },
    ],
  },
  flavorProfile: {
    title: "Flavor Profile",
    options: [
      { value: "sweet", label: "Sweet" },
      { value: "sour", label: "Sour" },
      { value: "bitter", label: "Bitter" },
      { value: "spicy", label: "Spicy" },
    ],
  },
  glassware: {
    title: "Glassware",
    options: [
      { value: "cocktail", label: "Cocktail Glass" },
      { value: "highball", label: "Highball Glass" },
      { value: "rocks", label: "Rocks Glass" },
      { value: "wine", label: "Wine Glass" },
    ],
  },
  temperature: {
    title: "Serving Temperature",
    options: [
      { value: "frozen", label: "Frozen" },
      { value: "cold", label: "Cold" },
      { value: "room", label: "Room Temperature" },
      { value: "hot", label: "Hot" },
    ],
  },
};

export function SearchFilters() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(Object.keys(FILTERS).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium text-primary">Filters</h3>
      </div>

      <div className="space-y-6">
        {Object.entries(FILTERS).map(([key, section]) => (
          <div
            key={key}
            className="border-b border-primary/10 pb-4 last:border-0"
          >
            <button
              onClick={() => toggleSection(key)}
              className="flex items-center justify-between w-full text-left mb-2"
            >
              <span className="font-medium text-primary">{section.title}</span>
              {expandedSections[key] ? (
                <ChevronUp className="h-4 w-4 text-primary/60" />
              ) : (
                <ChevronDown className="h-4 w-4 text-primary/60" />
              )}
            </button>

            {expandedSections[key] && (
              <div className="space-y-2 mt-3">
                {section.options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-primary/20 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-primary/70">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
