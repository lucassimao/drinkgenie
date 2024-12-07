import React from "react";
import { ShoppingCart } from "lucide-react";

interface AffiliatedLinksProps {
  ingredients: string[];
}

interface Store {
  name: string;
  logo: string;
  baseUrl: string;
}

const STORES: Store[] = [
  {
    name: "Amazon",
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=50&h=50&q=80",
    baseUrl: "https://www.amazon.com/s?k=",
  },
  {
    name: "Total Wine",
    logo: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=50&h=50&q=80",
    baseUrl: "https://www.totalwine.com/search/all?text=",
  },
  {
    name: "Drizly",
    logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=50&h=50&q=80",
    baseUrl: "https://drizly.com/search?q=",
  },
];

export function AffiliatedLinks({ ingredients }: AffiliatedLinksProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-warning/10 rounded-full">
          <ShoppingCart className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h2 className="text-2xl font-display text-primary">
            Get the Ingredients
          </h2>
          <p className="mt-2 text-primary/60">
            Find everything you need from our trusted partners
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {STORES.map((store) => (
          <div key={store.name} className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={store.logo}
                alt={store.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <h3 className="font-medium text-primary">{store.name}</h3>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient) => (
                <a
                  key={`${store.name}-${ingredient}`}
                  href={`${store.baseUrl}${encodeURIComponent(ingredient)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-warning/10 transition-colors group"
                >
                  <span className="text-primary/80 group-hover:text-primary">
                    {ingredient}
                  </span>
                  <span className="text-sm text-primary/60 group-hover:text-primary">
                    Shop →
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-sm text-primary/60 text-center">
        *Prices and availability may vary. We may earn a commission from
        qualifying purchases.
      </p>
    </div>
  );
}
