import NavBar from "@/components/Navbar/Navbar";
import { HandleLogout } from "@/services/userServices";
import { Button } from "react-bootstrap";
import style from "./Admin.module.scss";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className={style.wrapper}>{children}</div>
      {/* <Button onClick={HandleLogout}>Log out</Button> */}
    </div>
  );
};

export default AdminLayout;
