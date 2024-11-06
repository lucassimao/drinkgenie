import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function BestIdeasListing() {
  return (
    <div className="flex flex-wrap justify-between">
      {[1, 2, 3, 4].map((i) => (
        <Card
          key={`card${i}`}
          className="mb-6 mx-4 p-4 bg-blue-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
        >
          <CardHeader className="mb-2">
            <CardTitle className="text-lg font-bold text-gray-800">
              Card Title {`${i}`}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Card Description
            </CardDescription>
          </CardHeader>
          <CardContent className="mb-4">
            <p className="text-gray-700">Card Content</p>
          </CardContent>
          <CardFooter className="pt-2 border-t border-gray-300">
            <p className="text-sm text-gray-500">Card Footer</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
