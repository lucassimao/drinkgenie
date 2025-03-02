import { checkSubscription } from "@/lib/actions";
import { Sparkles, Star } from "lucide-react";
import Link from "next/link";

export async function PremiumActionButton() {
  const { hasActiveSubscription } = await checkSubscription();

  return (
    <>
      {hasActiveSubscription ? (
        <Link
          href="/ai-builder"
          className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r 
                   from-accent to-warning text-white rounded-xl font-medium group
                   transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                   relative overflow-hidden"
        >
          {/* Animated background */}
          <div
            className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full 
                       group-hover:translate-x-full transition-transform duration-1000"
          />

          {/* Content */}
          <div className="relative flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span>Mix Your Magic Now</span>
          </div>
        </Link>
      ) : (
        <Link
          href="/subscription"
          className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r 
                   from-accent to-warning text-white rounded-xl font-medium group
                   transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg
                   relative overflow-hidden"
        >
          {/* Animated background */}
          <div
            className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full 
                       group-hover:translate-x-full transition-transform duration-1000"
          />

          {/* Content */}
          <div className="relative flex items-center gap-2">
            <Star className="h-5 w-5" />
            <span>Unlock Premium</span>
          </div>
        </Link>
      )}
    </>
  );
}
