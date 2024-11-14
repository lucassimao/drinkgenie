import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function TipPage() {
  const user = await currentUser();

  if (!user) {
    return redirect(`/sign-up`);
  }

  return (
    <main className="m-5">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        Thirsty for More?
      </h1>

      <div className="mb-6">
        <Image
          src="/genie-drinking-a-cocktail-in-a-bar-1.jpg"
          alt="Cocktail illustration"
          width={250}
          height={250}
          className="rounded-full mx-auto"
        />
      </div>

      <p className="text-lg text-center mb-4 py-2 px-4 bg-primary/10 rounded-lg inline-block font-semibold transform -rotate-2">
        We hope you loved your free drink recipe!
      </p>

      <p className="text-center mb-6">
        Ready to dive into even more delicious concoctions? For{" "}
        <span className="font-semibold">just $1 per recipe </span>(or whatever
        amount you choose!), you can get unlimited access.
      </p>

      <div className="bg-palette-sandy_brown-700 p-4 rounded-lg mb-6">
        <p className="text-sm">
          Pick your amount - every dollar counts as a credit. So whether
          it&apos;s $1, $5, or $20, you&apos;ll be supporting our virtual bar
          and unlocking even more great recipes to enjoy.
        </p>
      </div>

      <a
        href={`https://donate.stripe.com/dR66qdcridRo6bubIK?prefilled_email=${user.emailAddresses}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button className="w-full w-full flex flex-col items-center py-10 text-lg font-bold transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
          <span className="mt-0 p-0">Unlock Recipes</span>
          <span className="text-xs mt-0 p-0 opacity-80">
            You will be redirected to Stripe for secure payment.
          </span>
        </Button>
      </a>
    </main>
  );
}
