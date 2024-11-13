"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiArrowLongLeft } from "react-icons/hi2";

export function Toolbar() {
  const { user } = useUser();
  const pathname = usePathname();

  const isHomePage = pathname == "/";
  return (
    <div className="flex justify-between w-full text-sm p-4">
      {!isHomePage ? (
        <Link href="/" className="flex items-center">
          <HiArrowLongLeft className="mr-4" />
          Back to home
        </Link>
      ) : (
        <div />
      )}

      <div className="flex items-center">
        <SignedOut>
          <Link href="/sign-in">Sign In</Link>
        </SignedOut>
        <Avatar className="mr-2 w-[25px] h-[25px]">
          <AvatarImage src={user?.imageUrl} />
        </Avatar>
        <span>{user?.fullName}</span>
        <SignedIn>
          <span className="mx-2">|</span>
          <SignOutButton />
        </SignedIn>
      </div>
    </div>
  );
}
