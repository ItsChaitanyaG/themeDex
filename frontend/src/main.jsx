import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Layout from "./Layout.jsx";
import Home from "./Components/Home.jsx";
import { Toaster } from 'react-hot-toast';


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       { path: "/home", element: <Home /> },
//     ],
//   },
// ]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <RouterProvider router={router} />*/}
    <Toaster/>
    <Home/>
  </StrictMode>,
);
