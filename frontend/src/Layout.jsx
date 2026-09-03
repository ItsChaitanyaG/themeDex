import React from "react";

import Footer from "./Components/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <div className="w-screen h-screen">

        <Outlet />
        <Footer />
      </div>
    </>
  );
}
