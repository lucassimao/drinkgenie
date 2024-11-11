"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
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
        <Avatar className="mr-2 w-[25px] h-[25px]">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span>{user?.fullName}</span>
      </div>
    </div>
  );
}
