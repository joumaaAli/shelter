// import { Image } from "react-bootstrap";
import Image from "next/image";
import Carousel from "react-bootstrap/Carousel";
import HeaderImage from "@/utils/img/slide1.jpg";
import HeaderImage2 from "@/utils/img/slide22.jpg";
import HeaderImage3 from "@/utils/img/slide33.jpg";

const carouselItems = [
  {
    imgSrc: HeaderImage,
  },
  {
    imgSrc: HeaderImage2,
  },
  {
    imgSrc: HeaderImage3,
  },
];

function CarouselComponent() {
  return (
    <Carousel>
      {carouselItems.map((item, index) => (
        <Carousel.Item key={index}>
          <Image
            style={{
              width: "100%",
              height: "60vh",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={item.imgSrc}
            alt="Facebook Cover Image"
          />
          {/* <Carousel.Caption className="h-100 w-100 m-0 px-0 d-flex flex-column align-items-start justify-content-start">
            <h3
              style={{
                fontSize: "60px",
                color: "#001f3f",
                fontFamily: "Montserrat, sans-serif",
                width: "50%",
                textAlign: "left",
              }}
            >
              {item.title}
            </h3>
            <p>{item.caption}</p>
          </Carousel.Caption> */}
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default CarouselComponent;
