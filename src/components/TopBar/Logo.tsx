import Image from "next/image";
import Link from "next/link";
import cheerfulGenie from "@/../public/cheerful-genie.png";

export function Logo() {
  return (
    <Link
      className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
      href="/"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-accent/20 rounded-full blur animate-pulse" />
        <Image
          alt="DrinkGenie logo"
          src={cheerfulGenie}
          className="h-8 w-8 text-secondary relative"
        />
      </div>
      <span className="text-2xl font-display text-primary">DrinkGenie</span>
    </Link>
  );
}
