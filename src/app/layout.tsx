import { Toolbar } from "@/components/toolbar";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
const rubik = Rubik({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DrinkGenie",
  description: `Your go-to for crafting the perfect cocktail! Whether you're a home mixologist, a professional bartender, or just someone who loves exploring new drinks, DrinkGenie is here to grant your cocktail wishes. Simply enter your preferred ingredients, flavors, or vibe, and let the Genie do the magic.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SpeedInsights />
      <ClerkProvider>
        <body className={rubik.className}>
          <Suspense>
            <Toolbar />
          </Suspense>
          {children}
          <Toaster richColors />
        </body>
      </ClerkProvider>
    </html>
  );
}
