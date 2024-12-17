type FilterSection = {
  title: string;
  options: { value: string; label: string }[];
};

export const FILTERS: Record<string, FilterSection> = {
  alcoholContent: {
    title: "Alcohol Content",
    options: [
      { value: "non_alcoholic", label: "Non-Alcoholic" },
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
