import React, { ReactNode } from "react";
import style from "./Auth.module.scss";
import NavBar from "@/components/Navbar/Navbar";

const AuthLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className={style["main"]}>{children}</div>
    </>
  );
};

export default AuthLayout;
