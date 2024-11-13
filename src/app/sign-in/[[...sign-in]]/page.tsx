import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="m-5">
      <SignIn />
    </main>
  );
}
