import { Toolbar } from "@/components/toolbar";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drink Genie",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={rubik.className}>
          <Toolbar />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
