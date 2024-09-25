import { ContactInfo } from "../Contact/ContactInfo";
import style from "./Footer.module.scss";

function Footer() {
  return (
      <div className={`text-light py-4 shadow ${style['footer-gradient']}`}>
          <div className="container">
              <div className="row d-flex justify-content-center">
                  <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center mb-2 mb-lg-0">
                      <ContactInfo/>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default Footer;
