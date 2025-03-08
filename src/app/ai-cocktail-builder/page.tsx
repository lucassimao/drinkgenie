import React from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IngredientForm } from "@/components/IngredientForm";
import { Metadata } from "next";
import { checkSubscription } from "@/lib/actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "AI Cocktail Builder | Mixology Magic",
  description:
    "Create custom cocktails with AI using ingredients you have on hand",
};

export default async function AIBuilderPage() {
  // Verify subscription status
  const { hasActiveSubscription } = await checkSubscription();

  // Redirect if no active subscription
  if (!hasActiveSubscription) {
    redirect("/subscription");
  }

  return (
    <main className="container max-w-6xl mx-auto px-4 py-8 min-h-screen">
      <Breadcrumbs
        items={[{ label: "Home", path: "/" }, { label: "AI Cocktail Builder" }]}
      />

      <div className="mt-8 text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display text-primary">
          <span className="block mb-3">Craft Your</span>
          <span className="bg-linear-to-r from-accent to-warning bg-clip-text text-transparent">
            Perfect Cocktail
          </span>
        </h1>

        <p className="text-lg text-primary/70 leading-relaxed">
          Describe your ideal drink or ingredients you have on hand, and our AI
          will craft a personalized cocktail recipe just for you.
        </p>
      </div>

      <div className="mt-10">
        <IngredientForm />
      </div>
    </main>
  );
}
