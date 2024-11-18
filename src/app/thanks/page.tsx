import { Button } from "@/components/ui/button";
import { checkSessionStatus } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const SuccesfulContent = () => (
  <div>
    <p className="text-center mb-6">
      You&apos;re amazing — thank you for supporting DrinkGenie.com! Your
      generous contribution helps us keep the cocktail magic alive and flowing.
      As a token of our gratitude, your tip unlocks access to even more exciting
      drink recipes, crafted just for you.
    </p>

    <p className="text-center mb-6">
      From classic cocktails to creative concoctions, you’re about to discover a
      world of flavors, one sip at a time. Cheers to you for making the world of
      mixology even more delicious!
    </p>
    <Link href="/">
      <Button className="w-full w-full flex flex-col items-center py-10 text-lg font-bold transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
        <span className="mt-0 p-0">Let’s shake things up !</span>
        <span className="text-xs mt-0 p-0 opacity-80">
          You will be taken to the homepage.
        </span>
      </Button>
    </Link>
  </div>
);

const ErrorContent = async () => {
  const user = await currentUser();

  return (
    <div>
      <p className="text-center mb-6">
        We hit a snag while processing your payment. Don&apos;t worry, your
        cocktail journey isn&apos;t over yet! Please try again, and let&apos;s
        get you back to unlocking delicious recipes. Cheers!
      </p>

      <a
        href={`https://donate.stripe.com/dR66qdcridRo6bubIK?prefilled_email=${user?.emailAddresses?.[0]?.emailAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button className="w-full w-full flex flex-col items-center py-10 text-lg font-bold transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
          <span className="mt-0 p-0">Try again</span>
          <span className="text-xs mt-0 p-0 opacity-80">
            You will be redirected to Stripe for secure payment.
          </span>
        </Button>
      </a>
    </div>
  );
};

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const stripeSession = (await searchParams).session;

  if (!stripeSession || typeof stripeSession != "string") {
    return redirect(`/`);
  }

  const result = await checkSessionStatus(stripeSession);
  const title = result ? "Thank you" : "Oups, Something Went Wrong";

  return (
    <main className="m-5">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">
        {title}
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

      {result ? <SuccesfulContent /> : <ErrorContent />}
    </main>
  );
}
