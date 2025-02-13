"use client";

import { PartyPopper, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4 relative">
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div
          className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-warning/20 blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-accent to-warning p-6 rounded-full inline-flex">
              <PartyPopper className="h-12 w-12 text-white" />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative h-full">
            <Confetti
              width={400}
              height={300}
              numberOfPieces={50}
              recycle={false}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
            <h1 className="text-3xl font-display text-primary mb-4">
              Welcome to Premium!
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-warning" />
              <p className="text-lg text-primary/80">
                Your premium journey begins now
              </p>
              <Sparkles className="h-5 w-5 text-warning" />
            </div>

            {/* Premium Badge */}
            <div className="bg-background rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Shield className="h-6 w-6 text-accent" />
                <span className="text-2xl font-bold text-primary">
                  Premium Member
                </span>
              </div>
              <p className="text-primary/60 mt-2">
                All premium features are now unlocked
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/"
            className="inline-block w-full bg-gradient-to-r from-accent to-warning text-white rounded-xl 
                     py-4 font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 
                     transform hover:scale-[1.02]"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
