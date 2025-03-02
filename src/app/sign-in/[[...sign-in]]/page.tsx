import cheerfulGenie from "@/../public/cheerful-genie.png";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center py-12 px-4">
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
              Welcome Back!
            </h2>
            <div className="flex items-center justify-center gap-2 text-primary/60">
              <p className="text-primary/60">
                Sign in to continue your mixology journey
              </p>
            </div>
          </div>

          {/* Clerk Sign In Component */}
          <SignIn
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
                dividerRow: "hidden",
                formFieldRow: "hidden",
                footerAction: "hidden",
                footer: "hidden",
              },
            }}
            routing="path"
            path="/sign-in"
            redirectUrl={
              typeof window !== "undefined"
                ? new URLSearchParams(window.location.search).get(
                    "redirect_url",
                  ) || "/search"
                : "/search"
            }
            fallbackRedirectUrl="/"
          />

          <div className="mt-8 text-center space-y-2">
            <p className="text-primary/60 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-accent hover:text-accent-dark font-medium transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
