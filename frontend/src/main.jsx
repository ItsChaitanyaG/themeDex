import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Item from "./Components/Item";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout.jsx";
import Menu from "./Components/Menu.jsx";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },
      { path: "/home", element: <Menu /> },
      { path: "/home/:id", element: <Item /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
