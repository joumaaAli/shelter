import About from "@/components/About/About";
import CarouselComponent from "@/components/Carousel/Carousel";
import { ImageGallery } from "@/components/Images/Images";
import { Container } from "react-bootstrap";
import style from "./home.module.scss";

const HomePage = () => {
  return (
    <div className={style.home}>
      <div className={style.carouselWrapper}>
        <CarouselComponent />
      </div>
      <button type="button" class="btn btn-primary" direction>
        لوضع اعلان اضغط هنا
      </button>
      <button type="button" class="btn btn-primary" direction>
        للاطلاع على الاعلانات الموجودة اضغط هنا
      </button>
      <div className="w-100 d-flex  flex-column align-items-center">
        <About />
        <ImageGallery />
      </div>
    </div>
  );
};

export default HomePage;
