import { Container, Row, Col, Card } from "react-bootstrap";
import Image, { StaticImageData } from "next/image";
import styles from "./services.module.scss";
import HeroImage from "@/utils/img/slide1.png";
import Card1 from "@/utils/img/card-1.jpg";
import Card2 from "@/utils/img/card-2.jpg";

interface ServiceCardProps {
  image: StaticImageData;
  title: string;
  text: string;
}

const Services = () => {
  const servicesData: ServiceCardProps[] = [
    {
      image: Card1,
      title: "Service 1",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      image: Card2,
      title: "Service 2",
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      image: Card1,
      title: "Service 3",
      text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    },
    {
      image: Card2,
      title: "Service 4",
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    },
  ];

  const ServiceCard: React.FC<ServiceCardProps> = ({ image, title, text }) => {
    return (
      <div className={styles.fadeIn}>
        <Card>
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            className="card-img-top"
          />
          <Card.Body>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{text}</Card.Text>
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <Image
          src={HeroImage}
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          className={styles.heroImage}
        />
        <div className={styles.heroText}>
          <h1>Our Services</h1>
          <p>We provide the best services in the industry.</p>
        </div>
      </div>

      {/* Services Section */}
      <Container className="my-5">
        <Row>
          {servicesData.map((service, index) => (
            <Col key={index} md={4} className="mb-4">
              <ServiceCard
                image={service.image}
                title={service.title}
                text={service.text}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Services;
