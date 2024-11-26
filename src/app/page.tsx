import { Form } from "@/components/form";
import { LatestIdeasListing } from "@/components/latestIdeasListing";
import Image from "next/image";
import cheerfulGenie from "../../public/cheerful-genie.png";

export const maxDuration = 60; // Applies to the actions

export default async function Home(props: {
  searchParams?: Promise<{
    page?: string;
    ingredient?: string;
  }>;
}) {
  const page = +((await props.searchParams)?.page as string) || 1;
  const ingredient = (await props.searchParams)?.ingredient as string;
  const isHomePage = page == 1 && !ingredient;

  return (
    <main className="m-5  h-screen rounded-lg flex flex-col items-center pb-15">
      {isHomePage && (
        <div className="flex flex-col items-center mx-auto w-5/6 mb-5 max-w-7xl">
          <Image
            className="mb-2 w-[33vw] md:w-[250px]"
            src={cheerfulGenie}
            alt="cheerful genie sipping a cockatail"
            priority
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 100vw"
          />

          <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl text-center">
            What&lsquo;s in Your Kitchen?
          </h1>

          <Form />
        </div>
      )}

      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
        {ingredient
          ? `Drinks starring ${ingredient}`
          : "Thirsty for Inspiration ?"}
      </h2>

      <LatestIdeasListing page={page} ingredient={ingredient} />
    </main>
  );
}
