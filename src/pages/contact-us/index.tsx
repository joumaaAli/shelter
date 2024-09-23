import { ContactForm } from "../../components/Form/Contact/ContactForm";
import styles from "./Contact.module.scss";

const Contact = () => {
  return (
    <div className={styles.headerMargin}>
      <div className={styles.contact}>
        <h2>Location</h2>
        <div className={styles.map}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15319.820734294997!2d-61.5121105!3d16.2740673!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c1349a53a72b509%3A0x9a3c67baafe4a5ab!2sURPS-ML%20Guadeloupe!5e0!3m2!1sen!2slb!4v1721993874401!5m2!1sen!2slb"
            title="map2"
          ></iframe>
        </div>
        <div className={styles.section}>
          <div className={styles.text}>
            97142 Rue Gaston Dorocant, Les Abymes 97142, Guadeloupe
          </div>
          {/* <div className="d-flex">
            <FontAwesomeIcon
              icon={faPhoneAlt}
              style={{ fontSize: "24px", color: "blue" }}
            />
            <FontAwesomeIcon
              icon={faMobileAlt}
              style={{ fontSize: "24px", color: "green" }}
            />
            <FontAwesomeIcon
              icon={faBriefcase}
              style={{ fontSize: "24px", color: "red" }}
            />
          </div> */}
        </div>
        <div className={styles.formWrapper}>
          <h2>To Suggest</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;
