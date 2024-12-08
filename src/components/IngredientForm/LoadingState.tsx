import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

const LOADING_MESSAGES = [
  "Consulting our magical recipe book...",
  "Mixing ingredients in our virtual shaker...",
  "Summoning the perfect cocktail combinations...",
  "Adding a dash of AI magic...",
];

export function LoadingState() {
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="relative mb-6">
          {/* Animated sparkles */}
          <div className="absolute -top-6 -right-6">
            <Sparkles className="h-5 w-5 text-warning animate-pulse" />
          </div>
          <div className="absolute -bottom-6 -left-6">
            <Sparkles
              className="h-5 w-5 text-warning animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          {/* Main loader */}
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-accent to-warning p-4 rounded-full">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
        </div>

        <p className="text-lg font-medium text-primary mb-2 min-h-[28px] transition-all duration-300">
          {LOADING_MESSAGES[messageIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-primary/10 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-warning rounded-full animate-shimmer"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>
    </div>
  );
}
