import { NextUIProvider } from "@nextui-org/react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MyNavBar from "./components/NavBar";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from "./pages/UploadPage";
import ViewPage from "./pages/ViewPage";
import PendingRequestsPage from "./pages/PendingRequestPage";
import RequestPage from "./pages/RequestPage";

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
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/upload",
    element: <UploadPage />
  },
  {
    path: "/view",
    element: <ViewPage />
  },
  {
    path: "/pending",
    element: <PendingRequestsPage />
  },
  {
    path: "/request",
    element: <RequestPage />
  }
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
