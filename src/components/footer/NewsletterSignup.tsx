"use client";

import React, { useState } from "react";
import { Send, PartyPopper } from "lucide-react";
import { saveSubscriber } from "@/lib/newsletter";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    await saveSubscriber(email);

    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className="bg-white/5 rounded-lg p-6 text-center transform animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-accent/20 rounded-full">
            <PartyPopper className="h-6 w-6 text-accent" />
          </div>
        </div>
        <h4 className="text-lg font-semibold text-white mb-2">
          Thanks for joining us! 🎉
        </h4>
        <p className="text-sm text-white/70">
          Welcome to the DrinkGenie family! Check your inbox for a special
          welcome gift and our latest cocktail recipes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
      <p className="text-sm text-white/70">
        Get weekly cocktail recipes and mixology tips!
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg 
                   text-white placeholder-white/40 focus:outline-hidden focus:border-white/20"
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark 
                   transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Subscribing...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Subscribe</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
