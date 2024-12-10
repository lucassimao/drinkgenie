"use client";
import { useToast } from "@/hooks/useToast";
import { createCheckoutSession } from "@/lib/subscription";
import { useUser } from "@clerk/nextjs";
import { Coins, Info, Loader2, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [credits, setCredits] = useState(10);
  const { user } = useUser();
  const pricePerCredit = 1;
  const [isPurchasing, setIsPurchasing] = useState(false);
  const toast = useToast();

  const popularAmounts = [10, 25, 50, 100];
  const features = [
    "Generate unique AI cocktail recipes",
    "Access professional mixing techniques",
    "Get ingredient substitution suggestions",
    "View detailed preparation instructions",
    "Save recipes to your collection",
    "Credits never expire",
  ];

  function getTotalAmount() {
    return (
      credits *
      pricePerCredit *
      (credits >= 100 ? 0.8 : credits >= 50 ? 0.9 : 1)
    );
  }

  async function handlePurchase() {
    setIsPurchasing(true);

    const email = user?.emailAddresses.find(
      (item) => item.emailAddress,
    )?.emailAddress;

    const stripeCheckoutLink = await createCheckoutSession(
      credits,
      getTotalAmount() * 100,
      email,
    );
    if (!stripeCheckoutLink) {
      toast.error(
        `Something went wrong. Could you try again within a few min?`,
        "Ooops",
      );
      return;
    }
    window.location.href = stripeCheckoutLink;
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display text-primary mb-4">
            DrinkGenie Credits
          </h1>
          <p className="text-primary/60 max-w-2xl mx-auto">
            Purchase credits to unlock magical cocktail creations. Each credit
            lets you generate a unique recipe with professional features. Buy
            more to save!
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Credit Selection */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-warning/10 rounded-full">
                <Coins className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h2 className="text-2xl font-display text-primary">
                  Select Credits
                </h2>
                <p className="text-primary/60">
                  1 credit = 1 magical cocktail creation
                </p>
              </div>
            </div>

            {/* Popular Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {popularAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setCredits(amount)}
                  disabled={isPurchasing}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    credits === amount
                      ? "border-accent bg-accent/5 shadow-lg"
                      : "border-primary/10 hover:border-accent/50"
                  } ${isPurchasing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="text-2xl font-bold text-primary mb-1">
                    {amount}
                  </div>
                  <div className="text-sm text-primary/60">credits</div>
                  {amount >= 50 && (
                    <div className="mt-2 text-xs text-accent font-medium">
                      Save {amount >= 100 ? "20%" : "10%"}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-primary/60 mb-2">
                Or enter custom amount:
              </label>
              <input
                type="number"
                min="1"
                value={credits}
                onChange={(e) =>
                  setCredits(Math.max(1, parseInt(e.target.value) || 0))
                }
                disabled={isPurchasing}
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 focus:border-accent 
                         focus:ring-2 focus:ring-accent/20 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed"
              />
            </div>

            {/* Price Calculation */}
            <div className="bg-background rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-primary/60">Price per credit:</div>
                <div className="font-medium text-primary">
                  ${pricePerCredit.toFixed(2)}
                </div>
              </div>
              {credits >= 50 && (
                <div className="flex items-center justify-between mb-4 text-accent">
                  <div>Bulk discount:</div>
                  <div>-{credits >= 100 ? "20" : "10"}%</div>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold text-primary pt-4 border-t border-primary/10">
                <div>Total:</div>
                <div>${getTotalAmount().toFixed(2)}</div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-accent" />
                <h3 className="font-medium text-primary">
                  What you get with credits:
                </h3>
              </div>
              <ul className="grid gap-3">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-primary/80"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-accent to-warning 
                       text-white font-medium flex items-center justify-center gap-2
                       transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg
                       disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                       disabled:hover:shadow-none relative overflow-hidden group"
            >
              {isPurchasing ? (
                <>
                  <div
                    className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full 
                               group-hover:translate-x-full transition-transform duration-1000"
                  />
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full 
                               group-hover:translate-x-full transition-transform duration-1000"
                  />
                  <Zap className="h-5 w-5" />
                  <span>Purchase {credits} Credits</span>
                </>
              )}
            </button>
          </div>

          {/* Info Footer */}
          <div className="px-8 py-4 bg-primary/5 border-t border-primary/10">
            <div className="flex items-start gap-3 text-sm text-primary/60">
              <Info className="h-5 w-5 flex-shrink-0" />
              <p>
                Credits are non-refundable but never expire. Each credit allows
                you to generate one unique cocktail recipe with full access to
                professional features and detailed instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
