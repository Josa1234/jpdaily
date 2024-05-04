import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getDataDailyById, updateDataDaily } from "@/data/dailys";
import {
  Form,
  LoaderFunctionArgs,
  useLoaderData,
  redirect,
} from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Daily {
  id: number;
  title: string;
  notes: string;
  timeReminder: string;
  isDone: boolean;
}

interface ActionFunctionArgs {
  request: {
    formData: () => FormData;
  };
  params: {
    id: string;
  };
}
export function loader({ params }: LoaderFunctionArgs) {
  const dataDailyId = Number(params.id);
  const dataDailysPromise = getDataDailyById(dataDailyId);
  return { dataDailysPromise };
}

export function action({ request, params }: ActionFunctionArgs) {
  const formData = request.formData();
  const updates = Object.fromEntries(formData);
  return updateDataDaily(parseInt(params.id), updates)
    .then((updatedDaily) => redirect(`/notes/${updatedDaily.id}`))
    .catch((error) => {
      console.error("Error updating daily:", error);
      return redirect(`/notes/${params.id}`);
    });
}

export function EditTask() {
  const { dataDailysPromise } = useLoaderData() as ReturnType<typeof loader>;
  const [daily, setDaily] = useState<Daily | undefined>(undefined);

  useEffect(() => {
    dataDailysPromise
      .then((data) => setDaily(data))
      .catch((error) => console.error(error));
  }, [dataDailysPromise]);

  if (!daily) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <Card className="w-[350px] mx-auto my-5">
        <Form method="post">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  placeholder="Title"
                  aria-label="Title"
                  type="text"
                  name="title"
                  className="mt-5"
                  defaultValue={daily.title}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Textarea
                  name="notes"
                  placeholder="Take Notes"
                  defaultValue={daily.notes}
                  rows={6}
                />
              </div>
              <div className="flex space-y-1.5">
                <div className="flex">
                  <Input type="checkbox" name="isDone" className="mr-1" />
                  <Label htmlFor="isDone" className="w-32 content-center">
                    Is Done
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="mr-3">
              Save
            </Button>
            <Button type="button">Cancel</Button>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
