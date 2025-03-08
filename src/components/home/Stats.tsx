import React from "react";
import { CountUp } from "./CountUp";
import { getStats } from "@/lib/drinks";

export async function Stats() {
  const stats = await getStats();

  return (
    <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center px-2 sm:px-4 py-2 sm:py-3 bg-white/5 rounded-xl backdrop-blur-xs
                 border border-white/10 hover:border-white/20 transition-colors"
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-accent mb-1">
            <CountUp
              end={stat.value}
              suffix={stat.suffix}
              decimals={stat.decimals}
            />
          </div>
          <div className="text-xs sm:text-sm text-primary/60">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
