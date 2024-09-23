import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Navbar/Navbar";
import style from "./Default.module.scss";

const DefaultLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column justify-content-between h-100">
      <NavBar />
      <div className={style.body}>{children}</div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
