import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { BestIdeasListing } from "@/components/bestIdeasListing";
import { LatestIdeasListing } from "@/components/latestIdeasListing";

export default async function Home() {
  return (
    <main className="m-5 pt-[50px] h-screen rounded-lg flex flex-col items-center">
      <div className="flex flex-col items-center mx-auto w-5/6">
        <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl text-center">
          What&lsquo;s in Your Kitchen?
        </h1>

        <Textarea
          placeholder="Tell us what you have, and we'll mix up some magic!"
          className="bg-white mt-5 mb-3 h-auto min-h-[150px] max-h-[500px]"
        />

        <p className="text-sm text-muted-foreground text-center">
          Choose what&lsquo;s on hand, and we&lsquo;ll find the perfect drink
          for you.
        </p>

        <Button className="my-5 p-8 font-bold text-2xl shadow-md hover:shadow-lg active:scale-95 active:shadow-sm transition transform duration-150">
          {/* <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> */}
          Pour Me Some Ideas
        </Button>
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight my-5">
        Thirsty for Inspiration ?
      </h2>

      <LatestIdeasListing />

      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight my-5">
        Cheers to the Best !
      </h2>
      <BestIdeasListing />
    </main>
  );
}
