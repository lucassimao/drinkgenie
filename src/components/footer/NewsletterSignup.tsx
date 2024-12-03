"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

// TODO use server actions
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <div className="bg-white/5 rounded-lg p-4 text-center">
        <p className="text-white/90">Thanks for subscribing! 🎉</p>
        <p className="text-sm text-white/60 mt-2">
          Check your inbox for a welcome gift!
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
                   text-white placeholder-white/40 focus:outline-none focus:border-white/20"
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
              Subscribing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Subscribe
            </>
          )}
        </button>
      </form>
    </div>
  );
}
