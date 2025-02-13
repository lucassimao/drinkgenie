import { Crown } from "lucide-react";

const features = [
  {
    name: "Cocktail Recipes",
    description: "Access our extensive library of handcrafted cocktail recipes",
    free: true,
    premium: true,
  },
  {
    name: "AI Drink Generator",
    description:
      "Create custom cocktails with our AI using your favorite ingredients",
    free: false,
    premium: true,
  },
  {
    name: "Non-Alcoholic Alternatives",
    description:
      "Discover ingredient substitutions and non-alcoholic alternatives",
    free: false,
    premium: true,
  },
  {
    name: "Allergy Information",
    description: "Comprehensive allergen details for safer drinking",
    free: false,
    premium: true,
  },
  {
    name: "Temperature Guide",
    description: "Perfect serving temperature for each ingredient",
    free: false,
    premium: true,
  },
  {
    name: "Expert Food Pairing",
    description: "Professional recommendations for food combinations",
    free: false,
    premium: true,
  },
  {
    name: "Media Gallery",
    description:
      "Upload and share photos and videos of your cocktail creations",
    free: false,
    premium: true,
  },
];

export function FeaturesTable() {
  return (
    <div className="w-full mb-16 px-4 max-w-4xl mx-auto">
      {/* Mobile View */}
      <div className="md:hidden bg-white/5 rounded-2xl overflow-hidden">
        <div className="divide-y divide-white/10">
          {features.map((feature) => (
            <div key={feature.name} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-primary/90 font-medium">
                    {feature.name}
                    <div className="text-primary/60 text-sm mt-1">
                      {feature.description}
                    </div>
                  </div>
                </div>
                {feature.premium && !feature.free && (
                  <div className="bg-warning/20 text-warning px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Premium
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop/Tablet View */}
      <div className="hidden md:block bg-white/5 rounded-2xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-accent to-warning text-white">
              <th className="py-6 px-6 text-left text-lg font-display">
                Features
              </th>
              <th className="py-6 px-6 text-center text-lg font-display">
                Free
              </th>
              <th className="py-6 px-6 text-center text-lg font-display">
                Premium
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/[0.03]">
            {features.map((feature) => (
              <tr
                key={feature.name}
                className="border-b border-white/10 hover:bg-white/[0.06] transition-colors"
              >
                <td className="py-5 px-6">
                  <div className="text-primary/90 font-medium">
                    {feature.name}
                  </div>
                  <div className="text-primary/60 text-sm mt-1">
                    {feature.description}
                  </div>
                </td>
                <td className="py-5 px-6 text-center text-primary/80">
                  {feature.free ? "✓" : "−"}
                </td>
                <td className="py-5 px-6 text-center text-accent">
                  {feature.name === "AI Drink Generator" ? "Unlimited" : "✓"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
