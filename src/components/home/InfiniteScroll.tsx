"use client";

import React, { useState, useEffect, useRef } from "react";

export function InfiniteScroll({ items }: { items: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [duplicatedItems] = useState([...items, ...items]); // Duplicate items for seamless loop

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
      className="flex overflow-x-hidden whitespace-nowrap mask-gradient"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div className="flex gap-2 animate-scroll">
        {duplicatedItems.map((term, index) => (
          <button
            key={`${term}-${index}`}
            className="px-3 py-1.5 text-sm bg-primary/5 rounded-full text-primary 
                       hover:bg-primary/10 transition-colors whitespace-nowrap flex-shrink-0"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
