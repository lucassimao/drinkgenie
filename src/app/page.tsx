import { Form } from "@/components/form";
import { LatestIdeasListing } from "@/components/latestIdeasListing";

export const maxDuration = 60; // Applies to the actions

export default async function Home(props: {
  searchParams?: Promise<{
    page?: string;
    ingredient?: string;
  }>;
}) {
  const page = +((await props.searchParams)?.page as string) || 1;
  const ingredient = (await props.searchParams)?.ingredient as string;

  return (
    <main className="m-5 pt-[50px] h-screen rounded-lg flex flex-col items-center">
      <div className="flex flex-col items-center mx-auto w-5/6">
        <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-6xl text-center">
          What&lsquo;s in Your Kitchen?
        </h1>

        <Form />
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight my-5">
        Thirsty for Inspiration ?
      </h2>

      <LatestIdeasListing page={page} ingredient={ingredient} />
    </main>
  );
}
