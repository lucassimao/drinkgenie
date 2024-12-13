import AutoRedirectButton from "@/components/credits/success/AutoRedirectButton";
import { ArrowRight, GlassWater, PartyPopper, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const { credits } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
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
          <h1 className="text-3xl font-display text-primary mb-4">
            Payment Successful!
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-warning" />
            <p className="text-lg text-primary/80">
              {credits} magical credits added to your account
            </p>
            <Sparkles className="h-5 w-5 text-warning" />
          </div>

          {/* Credits Display */}
          <div className="bg-background rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <GlassWater className="h-6 w-6 text-accent" />
              <span className="text-2xl font-bold text-primary">
                {credits} Credits
              </span>
            </div>
            <p className="text-primary/60 mt-2">
              Ready to create amazing cocktails
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-4 mb-8">
            <p className="text-primary/80">
              Your credits are now available. Start creating unique cocktail
              recipes with professional features!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-accent to-warning text-white rounded-xl
                       flex items-center justify-center gap-2 transform hover:scale-[1.02] 
                       transition-all duration-300 hover:shadow-lg"
            >
              Start Creating
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Auto-redirect Notice */}
          <AutoRedirectButton />
        </div>
      </div>
    </div>
  );
}
