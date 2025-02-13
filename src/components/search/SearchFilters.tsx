"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FILTERS } from ".";

export function SearchFilters() {
  const router = useRouter();
  const [params, setParamsState] = useState<URLSearchParams>(useSearchParams());

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(Object.keys(FILTERS).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const onClickFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { section, option } = event.currentTarget.dataset;
    if (!section || !option) throw new Error("invalid element");

    const clonnedParams = new URLSearchParams(params);

    if (clonnedParams.has(section)) {
      const selectedOptions = clonnedParams.getAll(section);
      clonnedParams.delete(section);

      // if it exists already, removes it
      if (selectedOptions.includes(option)) {
        selectedOptions.forEach((o) => {
          if (o != option) {
            clonnedParams.append(section, o);
          }
        });
      } else {
        [...selectedOptions, option].forEach((o) =>
          clonnedParams.append(section, o),
        );
      }
    } else {
      clonnedParams.append(section, option);
    }

    setParamsState(clonnedParams);
    router.push(`/search?${clonnedParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs p-6">
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
                      checked={
                        params.has(key) &&
                        params.getAll(key).includes(option.value)
                      }
                      data-section={key}
                      data-option={option.value}
                      onChange={onClickFilter}
                      className="w-4 h-4 rounded-sm border-primary/20 text-accent focus:ring-accent"
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
