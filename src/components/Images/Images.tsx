import React from "react";
import Image, { StaticImageData } from "next/image";
import Maxime from "../../utils/img/avatar.jpg";
import style from "./Images.module.scss";

interface CardProps {
  image: StaticImageData;
  title: string;
  subtitle: string;
}

const cards: CardProps[] = [
  {
    image: Maxime,
    title: "JOURSON Malige",
    subtitle: "présidente",
  },
  {
    image: Maxime,
    title: "POPOTE Angelique",
    subtitle: "secrétaire",
  },
  {
    image: Maxime,
    title: "EZZAHRAOUI Mohamed",
    subtitle: "tresorier",
  },
  {
    image: Maxime,
    title: "PIEGAY Thomas",
    subtitle: "tresorier adjoint",
  },
  {
    image: Maxime,
    title: "PISIOU Cedrick",
    subtitle: "membre du bureau",
  },
  {
    image: Maxime,
    title: "DURAND Rémy",
    subtitle: "membre du bureau",
  },
  {
    image: Maxime,
    title: "GENNEN Maxime",
    subtitle: "membre du bureau",
  },
];
const Card: React.FC<CardProps> = ({ image, title, subtitle }) => (
  <figure className={style.snip1584}>
    <Image
      src={image}
      alt={title}
      layout="responsive"
      width={100}
      height={100}
      objectFit="cover"
    />
    <figcaption>
      <h3>{title}</h3>
      <h5 className="text-capitalize">{subtitle}</h5>
    </figcaption>
  </figure>
);

export const ImageGallery: React.FC = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center fs-1 mb-5 text-uppercase fw-bold">
        Members of the buisness
      </h2>
      <div className="row w-100">
        {cards.map((card, index) => (
          <div key={index} className="col-md-4 px-2 my-3">
            <Card
              image={card.image}
              title={card.title}
              subtitle={card.subtitle}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
