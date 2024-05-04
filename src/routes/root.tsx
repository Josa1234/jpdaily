import { CiSearch } from "react-icons/ci";
import { Outlet, Link, Form, useLoaderData } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  addNewDataDaily,
  deleteDataDailyById,
  getDataDailys,
  searchDailys,
} from "@/data/dailys";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React, { useState } from "react";
import { Label } from "@radix-ui/react-label";

interface Daily {
  id: number;
  title: string;
  notes: string;
  timeReminder: string;
  isDone: boolean;
}

export function loader() {
  const dataDailysPromise = getDataDailys();
  return { dataDailysPromise };
}

export function action({
  title,
  notes,
  isDone,
}: {
  title: string;
  notes: string;
  isDone: boolean;
}) {
  return addNewDataDaily({ title, notes, isDone })
    .then(() => {
      console.log("Data berhasil disimpan");
      return null;
    })
    .catch((error: Error) => {
      console.error("Terjadi kesalahan saat menyimpan data:", error);
      throw error;
    });
}

export function RootRoute() {
  const titleRef = React.useRef<HTMLInputElement>(null);
  const notesRef = React.useRef<HTMLTextAreaElement>(null);
  const isDoneRef = React.useRef<HTMLInputElement>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Daily[]>([]);

  const { dataDailysPromise } = useLoaderData() as ReturnType<typeof loader>;
  const [dataDailys, setDataDailys] = React.useState<Daily[]>([]);

  React.useEffect(() => {
    dataDailysPromise
      .then((data) => setDataDailys(data))
      .catch((error) => console.error(error));
  }, [dataDailysPromise]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchDailys(searchKeyword).then((results) => {
      setSearchResults(results);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = titleRef.current?.value || "";
    const notes = notesRef.current?.value || "";
    const isDone = isDoneRef.current?.checked || false;

    action({ title, notes, isDone });

    if (titleRef.current) titleRef.current.value = "";
    if (notesRef.current) notesRef.current.value = "";
    if (isDoneRef.current) isDoneRef.current.checked = false;
  };

  const handleDelete = (id: number) => {
    if (confirm("Please confirm you want to delete this record.")) {
      deleteDataDailyById(id).then((success) => {
        if (success) {
          setDataDailys((prevDataDailys) =>
            prevDataDailys.filter((daily) => daily.id !== id)
          );
        }
      });
    }
  };

  return (
    <>
      <header className="bg-slate-900 border-b-slate-500 border-b-2">
        <div className="flex justify-between">
          <div className="flex">
            <div className="content-center">
              <h1 className="tracking-widest text-2xl text-white font-semibold mx-24">
                JPDAILY
              </h1>
            </div>
            <Form onSubmit={handleSearch}>
              <div className="flex items-center">
                <div className="relative m-5">
                  <CiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    name="q"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-blue-700">
                  Search
                </Button>
              </div>
            </Form>
          </div>
          <div className="flex">
            <div className="content-center">
              <Avatar>
                <AvatarImage
                  src="https://plus.unsplash.com/premium_photo-1712416361680-660f671cd797?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Josa Pratama"
                />
                <AvatarFallback>Josa Pratama</AvatarFallback>
              </Avatar>
            </div>
            <div className="content-center">
              <h3 className="text-white text-xl mx-5 font-normal">
                Josa Pratama
              </h3>
            </div>
          </div>
        </div>
      </header>
      <section className="flex">
        <nav className="flex w-1/5 bg-slate-900 text-white h-screen">
          <ul>
            <li>
              <Link to={`/`}>
                <Button>Notes</Button>
              </Link>
            </li>
            <li>
              <Link to={`reminder`}>
                <Button>Reminder</Button>
              </Link>
            </li>
            <li>
              <Link to={"trash"}>
                <Button>Trash</Button>
              </Link>
            </li>
          </ul>
        </nav>
        <main className="w-full">
          <Card className="w-[350px] mx-auto my-5">
            <CardContent>
              <Form method="post" onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      type="text"
                      name="title"
                      placeholder="Create a Title"
                      className="mt-5 mx-auto w-80 outline-none border-none"
                      ref={titleRef}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Textarea
                      name="notes"
                      placeholder="Take Notes"
                      className="mb-3 mx-auto w-80"
                      ref={notesRef}
                    />
                  </div>
                  <div className="flex space-y-1.5">
                    <div className="flex">
                      <Input
                        type="checkbox"
                        name="isDone"
                        className="mr-1"
                        ref={isDoneRef}
                      />
                      <Label htmlFor="isDone" className="w-32 content-center">
                        Is Done
                      </Label>
                    </div>
                  </div>
                  <div className="flex space-y-1.5">
                    <Button type="submit">New</Button>
                  </div>
                </div>
              </Form>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-start">
            {searchKeyword.trim() !== ""
              ? searchResults.map((daily) => (
                  <Link key={daily.id} to={`/notes/${daily.id}`}>
                    <Card className="w-60 m-5">
                      <CardContent>{daily.title}</CardContent>
                      <CardContent>{daily.notes}</CardContent>
                      <CardFooter>
                        <Link to={`/notes/${daily.id}/edit`} className="mr-3">
                          <Button>Edit</Button>
                        </Link>
                        <Button onClick={() => handleDelete(daily.id)}>
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))
              : dataDailys.map((daily) => (
                  <Link key={daily.id} to={`/notes/${daily.id}`}>
                    <Card className="w-60 m-5">
                      <CardContent>{daily.title}</CardContent>
                      <CardContent>{daily.notes}</CardContent>
                      <CardFooter>
                        <Link to={`/notes/${daily.id}/edit`} className="mr-3">
                          <Button>Edit</Button>
                        </Link>
                        <Button onClick={() => handleDelete(daily.id)}>
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
          </div>
          <Outlet />
        </main>
      </section>
    </>
  );
}
