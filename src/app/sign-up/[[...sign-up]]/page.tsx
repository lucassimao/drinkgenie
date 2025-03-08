import { SignUp } from "@clerk/nextjs";

import cheerfulGenie from "@/../public/cheerful-genie.png";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl animate-float" />
        <div
          className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        {/* Main Card */}
        <div className="relative bg-white p-5 rounded-2xl shadow-xl max-w-md w-full backdrop-blur-xs border border-white/20">
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/20 rounded-full blur-lg animate-pulse"></div>
                <Image
                  alt="DrinkGenie logo"
                  src={cheerfulGenie}
                  className="h-10 w-10 md:h-20 md:w-20 text-white"
                />
              </div>
            </div>
            <h2 className="text-3xl font-display text-primary mb-2">
              Join DrinkGenie!
            </h2>
            <div className="flex items-center justify-center gap-2 text-primary/60">
              <p className="text-primary/60">
                Create your magical cocktail journey
              </p>
            </div>
          </div>

          <div className="mb-8 bg-background rounded-xl p-4">
            <ul className="space-y-3">
              {[
                "Save your favorite cocktail recipes",
                "Get personalized recommendations",
                "Share your creations with others",
              ].map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-primary/80"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Clerk Sign In Component */}
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto box-border",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "w-full mb-3 p-4 rounded-xl bg-linear-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg",
                socialButtonsBlockButtonText: "font-medium",
                socialButtonsProviderIcon: "w-5 h-5",
                // dividerRow: "hidden",
                // formFieldRow: "hidden",
                // footerAction: "hidden",
                footer: "hidden",
              },
            }}
            routing="path"
            path="/sign-up"
            fallbackRedirectUrl="/"
          />

          <div className="mt-8 text-center space-y-2">
            <p className="text-primary/60 text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-accent hover:text-accent-dark font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
