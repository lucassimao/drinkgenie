import { Crown, Lock, Shield } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import { FeaturesTable } from "./FeaturesTable";
import { SubscribeButton } from "./SubscribeButton";
import { SubscribeButtonFallback } from "./SubscribeButtonFallback";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/50 to-background py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-display text-primary mb-6">
            Elevate Your
            <span className="bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
              {" "}
              Mixology Game
            </span>
          </h1>
          <p className="text-xl text-primary/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of cocktail enthusiasts who&#39;ve unlocked the
            secrets to crafting perfect drinks with our premium features.
          </p>
        </div>

        <FeaturesTable />

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in-up relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-warning/20 rounded-full blur-3xl" />

          {/* Premium badge */}

          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="h-8 w-8 text-accent animate-pulse" />
            <h2 className="text-3xl font-display bg-gradient-to-r from-accent to-warning bg-clip-text text-transparent">
              Premium Access
            </h2>
          </div>

          <div className="mb-8">
            <div className="text-6xl font-display text-primary mb-2 flex items-center justify-center">
              <span className="text-2xl mr-1">$</span>5.99
              <span className="text-lg text-primary/60 font-normal ml-2">
                /month
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-primary/70">Risk-free - Cancel anytime</p>
              <div className="flex items-center gap-2 text-sm text-accent">
                <Shield className="h-4 w-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          <Suspense fallback={<SubscribeButtonFallback />}>
            <SubscribeButton />
          </Suspense>

          {/* Trust indicators */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-center gap-4 text-sm text-primary/60">
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                Secure payment
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                SSL encrypted
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/stripe-badge.svg"
                alt="Powered by Stripe"
                width={100}
                height={30}
                className="opacity-50 hover:opacity-75 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
