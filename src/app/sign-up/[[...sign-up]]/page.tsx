import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { HiArrowLongLeft } from "react-icons/hi2";

export default function Page() {
  return (
    <main className="m-5">
      <Link href="/" className="flex flex-row">
        <HiArrowLongLeft className="mr-4" />
        Back to home
      </Link>
      <SignUp />
    </main>
  );
}
