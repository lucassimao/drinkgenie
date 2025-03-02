"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { Loader2, LogIn, Sparkles } from "lucide-react";
import { useState } from "react";
import { createCheckoutSession } from "@/lib/subscription";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

export function SubscribeButton() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  async function handleSubscribe() {
    setIsLoading(true);
    const email = user?.emailAddresses.find(
      (item) => item.emailAddress,
    )?.emailAddress;

    try {
      const stripeCheckoutLink = await createCheckoutSession(1, 599, email);
      if (!stripeCheckoutLink) {
        toast.error("Failed to start checkout process", "Error");
        return;
      }
      window.location.href = stripeCheckoutLink;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", "Error");
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = () => router.push("/sign-in?redirect_url=/subscription#hero");

  return (
    <>
      <button
        onClick={isSignedIn ? handleSubscribe : signIn}
        disabled={isLoading}
        className="group w-full max-w-md bg-linear-to-r from-accent to-warning 
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
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : !isSignedIn ? (
            <>
              <LogIn className="w-5 h-5" />
              Sign in to Subscribe
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Unlock Premium Now
            </>
          )}
        </span>
      </button>
      {!isSignedIn && (
        <p className="mt-4 text-sm text-primary/60">
          Please sign in to access premium features
        </p>
      )}
    </>
  );
}
