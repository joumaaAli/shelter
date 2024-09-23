import React from "react";
import PropTypes from "prop-types";
import styles from "./FormationCard.module.scss";
import "remixicon/fonts/remixicon.css"; // Import Remixicon CSS
import { FormationType } from "@/types/models";
import moment from "moment";
import constructImage from "@/utils/supabase/constructImage";

const FormationCard: React.FC<FormationType> = ({
  theme,
  startDate,
  endDate,
  location,
  organism,
  phoneNumber,
  email,
  profileImg,
}) => {
  const formatDate = (date: any) => {
    return date.calendar(); // e.g., "September 21, 2024"
  };
  return (
    <div className={styles.card}>
      <div className={styles.card__border}>
        <div className={styles.card__perfil}>
          <img
            src={constructImage(profileImg)}
            alt="Profile"
            className={styles.card__img}
          />
        </div>
      </div>

      <h3 className={styles.card__name}>{theme}</h3>

      <div className={styles.info}>
        <div className={styles.info__icon}>
          <i className="ri-information-line"></i>
        </div>

        <div className={styles.info__border}>
          <div className={styles.info__perfil}>
            <img
              src={constructImage(profileImg)}
              alt="Profile"
              className={styles.info__img}
            />
          </div>
        </div>

        <div className={styles.info__data}>
          <h3 className={styles.info__name}>
            <strong>Organisme: </strong>
            {organism}
          </h3>
          <span className={styles.info__profession}>
            <strong>Lieu: </strong>
            {location}
          </span>
          <span className={styles.info__profession}>
            <strong>Date: </strong>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
          <span className={styles.info__profession}>
            <strong>Contact: </strong>
            {phoneNumber}
          </span>
          <span className={styles.info__location}>
            <strong>Email: </strong>
            {email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormationCard;
