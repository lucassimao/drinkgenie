"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AutoRedirectButton() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect after 10 seconds
    const timeout = setTimeout(() => {
      router.push("/");
    }, 10_000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <p className="text-sm text-primary/40 mt-8">
      You&apos;ll be automatically redirected to the home page in a few
      seconds...
    </p>
  );
}
