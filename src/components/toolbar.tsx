"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getUserCredits } from "@/lib/user";
import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiDrink } from "react-icons/bi";
import { HiArrowLeft } from "react-icons/hi2";

export function Toolbar() {
  const router = useRouter();
  const { user } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [credits, setCredits] = useState<number | null>(null);
  const isHomePage =
    pathname == "/" &&
    (searchParams.size == 0 ||
      (searchParams.size == 1 && searchParams.get(`page`) == `1`));

  useEffect(() => {
    if (!user) return;

    getUserCredits(user.id).then((credits) => setCredits(credits));
  }, [user, pathname]);

  return (
    <div className="flex justify-between w-full text-sm p-4 ">
      {!isHomePage ? (
        <div
          onClick={() => router.back()}
          className="flex items-center cursor-pointer"
        >
          <HiArrowLeft className="mr-2" />
          Go back
        </div>
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
          {credits && (
            <>
              <span className="mx-2">|</span>
              <div className="flex items-center justify-between w-10 py-0 m-0 ">
                {credits} <BiDrink />
              </div>
            </>
          )}
          <span className="mx-2">|</span>
          <SignOutButton />
        </SignedIn>
      </div>
    </div>
  );
}
