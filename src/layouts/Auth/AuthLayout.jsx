import NavBar from "@/components/Navbar/Navbar";
import style from "./Auth.module.scss";

const AuthLayout = ({ children }) => {
  return (
    <>
      <NavBar />
      <div className={style["main"]}>{children}</div>
    </>
  );
};

export default AuthLayout;
