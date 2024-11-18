import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="m-5 w-[768px] container mx-auto">
      <SignUp />
    </main>
  );
}
