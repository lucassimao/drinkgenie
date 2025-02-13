import { Loader2 } from "lucide-react";

export function SubscribeButtonFallback() {
  return (
    <button
      className="group w-full max-w-md bg-gradient-to-r from-accent to-warning 
               text-white rounded-xl py-4 font-medium text-lg
               shadow-lg hover:shadow-xl transition-all duration-300 
               transform hover:scale-[1.02] disabled:opacity-50 
               disabled:cursor-not-allowed relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-white/20 transform -skew-x-12 
                    -translate-x-full group-hover:translate-x-full transition-transform 
                    duration-1000"
      />
      <span className="relative flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading ...
      </span>
    </button>
  );
}
