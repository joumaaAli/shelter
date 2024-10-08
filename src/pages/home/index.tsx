import About from "@/components/About/About";
import CarouselComponent from "@/components/Carousel/Carousel";
import { Container } from "react-bootstrap";
import style from "./home.module.scss";

const HomePage = () => {
  return (
    <div className={style.home}>
      <Container>
        <CarouselComponent />
      </Container>
      <div className={style.carouselWrapper}></div>
      <About />
      <div className="w-100 d-flex  flex-column align-items-center"></div>
    </div>
  );
};

export default HomePage;
