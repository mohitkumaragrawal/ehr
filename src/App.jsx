import { NextUIProvider } from "@nextui-org/react";
import Home from "./pages/Home";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MyNavBar from "./components/NavBar";
import Doctor from "./pages/Doctor";
import AddDoctor from "./pages/AddDoctor";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <main>
        <div className="flex flex-col mx-auto max-w-6xl py-10">
          <h1 className="text-3xl font-bold">Welcome to EHR System</h1>
        </div>
      </main>
    ),
  },
  {
    path: "/patient",
    element: <Home />,
  },
  {
    path: "/doctor",
    element: <Doctor />,
  },
  {
    path: "/add-doctor",
    element: <AddDoctor />,
  },
]);

function App() {
  return (
    <NextUIProvider>
      <MyNavBar />
      <div className="p-2">
        <RouterProvider router={router} />
      </div>
    </NextUIProvider>
  );
}

export default App;
