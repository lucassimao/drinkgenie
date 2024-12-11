import { Footer } from "@/components/Footer";
import { ToastContainer } from "@/components/toast/ToastContainer";
import { TopBar } from "@/components/TopBar";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next";
import clsx from "clsx";
import type { Metadata } from "next";
import { Pacifico, Poppins } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";

const pacifico = Pacifico({
  display: "swap",
  weight: "400",
  subsets: ["latin"],
});
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  display: "swap",
  subsets: ["latin"],
});

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
      <Analytics />
      <SpeedInsights />

      <ClerkProvider>
        <body
          className={clsx(
            pacifico.className,
            poppins.className,
            "min-h-screen bg-background",
          )}
        >
          <Suspense>
            <TopBar />
          </Suspense>
          <div className="max-w-7xl mx-auto px-4">{children}</div>
          <Footer />
          <ToastContainer />
        </body>
      </ClerkProvider>
    </html>
  );
}
