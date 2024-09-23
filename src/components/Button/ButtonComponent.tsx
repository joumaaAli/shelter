import React from "react";
import styles from "./ButtonComponent.module.scss"; // Importer les styles SCSS

const ButtonComponent: React.FC = () => {
  return (
    <div className={styles.container}>
      <button type="button" className={`btn btn-primary btn-lg ${styles.btn}`}>
        لوضع اعلان اضغط هنا
      </button>
      <button
        type="button"
        className={`btn btn-secondary btn-lg ${styles.btn}`}
      >
        للاطلاع على الاعلانات الموجودة اضغط هنا
      </button>
    </div>
  );
};

export default ButtonComponent;
