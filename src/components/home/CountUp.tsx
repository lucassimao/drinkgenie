"use client";

import React, { useState, useEffect, useRef } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

export function CountUp({
  end,
  duration = 2000,
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = countRef.current;

    const step = () => {
      const currentTime = Date.now();
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const nextValue = startValue + (end - startValue) * easeOutQuart;
      countRef.current = nextValue;
      setCount(nextValue);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return (
    <div ref={elementRef} className="font-bold">
      {count.toFixed(decimals)}
      {suffix}
    </div>
  );
}
