"use client";

import { getDrinks } from "@/lib/drinks";
import { Drink } from "@/types/drink";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

type BasicDrinkInfo = Pick<Drink, "name" | "id" | "slug">;

export function InfiniteScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Duplicate items for seamless loop
  const [duplicatedItems, setDuplicatedItems] = useState<BasicDrinkInfo[]>([]);

  useEffect(() => {
    getDrinks({ sortBy: "popular", pageSize: 10, page: 1 })
      .then((drinks) =>
        drinks.map(({ id, name, slug }) => ({ id, name, slug })),
      )
      .then((drinks) => setDuplicatedItems([...drinks, ...drinks]));
  }, []);

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1;
        }
      }
    };

    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-hidden whitespace-nowrap mask-gradient w-full"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div className="flex gap-2 animate-scroll">
        {duplicatedItems.map((drink, index) => (
          <button
            key={`${drink.id}-${index}`}
            className="px-3 py-1.5 text-sm bg-primary/5 rounded-full text-primary 
                       hover:bg-primary/10 transition-colors whitespace-nowrap shrink-0"
          >
            <Link href={`/drink/${drink.slug}`}>{drink.name}</Link>
          </button>
        ))}
      </div>
    </div>
  );
}
