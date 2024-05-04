import { Card, CardContent } from "@/components/ui/card";
import { getDataDailyById } from "@/data/dailys";
import { useEffect, useState } from "react";
import { useLoaderData, LoaderFunctionArgs } from "react-router-dom";

interface Daily {
  id: number;
  title: string;
  notes: string;
  timeReminder: string;
  isDone: boolean;
}

export function loader({ params }: LoaderFunctionArgs) {
  const dataDailyId = Number(params.id);
  const dataDailysPromise = getDataDailyById(dataDailyId);
  return { dataDailysPromise };
}

export function DailyNotes() {
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
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <h2>{daily.title}</h2>
            </div>
            <div className="flex flex-col space-y-1.5">
              <h2>{daily.notes}</h2>
            </div>
            <div className="flex space-y-1.5">{daily.timeReminder}</div>
            <div className="flex space-y-1.5 items-center">{daily.isDone}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
