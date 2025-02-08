import React from "react";
import { CountUp } from "./CountUp";
import { getStats } from "@/lib/drinks";

export async function Stats() {
  const stats = await getStats();

  return (
    <div className="grid grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-left">
          <div className="text-2xl font-bold text-accent mb-1">
            <CountUp
              end={stat.value}
              suffix={stat.suffix}
              decimals={stat.decimals}
            />
          </div>
          <div className="text-sm text-primary/60">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
