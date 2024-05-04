import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

import { RootRoute, loader as rootLoader } from "@/routes/root";
import { EditTask } from "@/routes/edit";
import { ErrorPage } from "@/routes/error";
import { Reminder } from "@/routes/reminder";
import { Trash } from "@/routes/trash";

import "./index.css";
import { DailyNotes, loader as noteLoader } from "@/routes/daily";
import { updateDataDaily } from "@/data/dailys";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: "notes/:id",
        element: <DailyNotes />,
        loader: noteLoader,
      },
      {
        path: "notes/:id/edit",
        element: <EditTask />,
        loader: noteLoader,
        action: async ({ request, params }) => {
          const id = params.id || "";
          const formData = await request.formData();
          const updates = Object.fromEntries(formData);
          return updateDataDaily(parseInt(id), updates)
            .then((updatedDaily) => redirect(`/notes/${updatedDaily.id}`))
            .catch((error) => {
              console.error("Error updating daily:", error);
              return redirect(`/notes/${id}`);
            });
        },
      },
      {
        path: "reminder",
        element: <Reminder />,
      },
      {
        path: "trash",
        element: <Trash />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
