import NavBar from "@/components/Navbar/Navbar";
import style from "./Admin.module.scss";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className={style.wrapper}>{children}</div>
    </div>
  );
};

export default AdminLayout;
