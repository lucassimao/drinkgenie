import { ChevronUp, Filter } from "lucide-react";
import { FILTERS } from ".";

export function SearchFiltersFallback() {
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
            <button className="flex items-center justify-between w-full text-left mb-2">
              <span className="font-medium text-primary">{section.title}</span>
              <ChevronUp className="h-4 w-4 text-primary/60" />
            </button>

            <div className="space-y-2 mt-3">
              {section.options.map((option) => (
                <label key={option.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    data-section={key}
                    data-option={option.value}
                    className="w-4 h-4 rounded border-primary/20 text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-primary/70">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
