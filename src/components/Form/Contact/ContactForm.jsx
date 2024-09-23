import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import styles from "./ContactForm.module.scss";
import { Validator } from "@/utils/validation";

const Form = () => {
  const [form, setForm] = useState({});
  const formRef = useRef();
  const [error, setError] = useState({ name: "", number: "", email: "" });
  const [disabled, setIsDisabled] = useState(true);
  const rules = {
    name: "required|max:100",
    phoneNumber: "required|number",
    email: "nullable|email|max:255",
    details: "nullable",
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const field = event.target;
    const { value, id } = field;
    setForm((oldState) => ({ ...oldState, [id]: value }));
    const { success, errors } = Validator.validateField(id, value, rules[id]);

    if (success) {
      setError((oldErrors) => ({ ...oldErrors, [id]: "" }));
    } else {
      setError((oldErrors) => {
        setError((oldErrors) => ({ ...oldErrors, [id]: errors }));
        return oldErrors;
      });
      setIsDisabled(true);
    }
  };

  const sendEmail = () => {
    emailjs
      .sendForm(
        "service_pqp0336",
        "template_tb6qmbs",
        formRef.current,
        "Pxxpsee1bWS2uLy1N"
      )
      .then(
        (result) => {},
        (error) => {}
      );
  };

  useEffect(() => {
    const { success } = Validator.validate(form, rules);
    if (success) {
      setIsDisabled(false);
    }
  }, [form]);

  return (
    <div className={styles.box}>
      <form className={styles.form} ref={formRef}>
        <div className={styles.inputBox}>
          <input
            type="text"
            required={true}
            id="name"
            onChange={handleInputChange}
            name="name"
          />
          <span>Nom</span>
          <a>{error.name}</a>
          <i></i>
        </div>
        <div className={styles.inputBox}>
          <input
            required={true}
            id="phoneNumber"
            onChange={handleInputChange}
            name="phoneNumber"
          />
          <span>Numéro de téléphone</span>
          <a>{error.phoneNumber}</a>
          <i></i>
        </div>
        <div className={styles.inputBox}>
          <select
            placeholder="Service"
            id="service"
            onChange={(e) =>
              setForm((oldState) => ({ ...oldState, service: e.target.value }))
            }
            name="service"
          >
            <option>Auto</option>
            <option>Expat</option>
            <option>Médical</option>
            <option>Maritime</option>
            <option>Responsabilité civile</option>
            <option>Violence politique</option>
          </select>
          <i className={styles.select}></i>
        </div>
        <div className={styles.inputBox}>
          <input
            required={true}
            id="email"
            onChange={handleInputChange}
            name="email"
          />
          <span>Email</span>
          <a>{error.email}</a>
          <i></i>
        </div>
        <div className={styles.inputBox}>
          <input
            required={true}
            id="details"
            onChange={handleInputChange}
            name="details"
          />
          <span>Détails</span>
          <a>{error.details}</a>
          <i></i>
        </div>
        <button onClick={sendEmail} disabled={disabled}>
          Soumettre
        </button>
      </form>
    </div>
  );
};

export const ContactForm = () => {
  const [form, setForm] = useState({});
  const formRef = useRef();
  const [error, setError] = useState({ name: "", number: "", email: "" });
  const [disabled, setIsDisabled] = useState(true);
  const rules = {
    name: "required|max:100",
    phoneNumber: "required|number",
    email: "required|email|max:255",
    suggestions: "required",
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const field = event.target;
    const { value, id } = field;
    setForm((oldState) => ({ ...oldState, [id]: value }));
    const { success, errors } = Validator.validateField(id, value, rules[id]);

    if (success) {
      setError((oldErrors) => ({ ...oldErrors, [id]: "" }));
    } else {
      setError((oldErrors) => {
        setError((oldErrors) => ({ ...oldErrors, [id]: errors }));
        return oldErrors;
      });
      setIsDisabled(true);
    }
  };

  const sendEmail = () => {
    emailjs
      .sendForm(
        "service_pqp0336",
        "template_6j29dhp",
        formRef.current,
        "Pxxpsee1bWS2uLy1N"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  useEffect(() => {
    const { success } = Validator.validate(form, rules);
    if (success) {
      setIsDisabled(false);
    }
  }, [form]);

  return (
    <div className={`${styles.box} ${styles.boxSmall}`}>
      <form className={styles.form} ref={formRef}>
        <div className={styles.inputBox}>
          <input
            type="text"
            required={true}
            id="name"
            onChange={handleInputChange}
            name="name"
          />
          <span>Nom</span>
          <a>{error.name}</a>
          <i></i>
        </div>
        <div className={styles.inputBox}>
          <input
            required={true}
            id="phoneNumber"
            onChange={handleInputChange}
            name="phoneNumber"
          />
          <span>Numéro de téléphone</span>
          <a>{error.phoneNumber}</a>
          <i></i>
        </div>
        <div className={styles.inputBox}>
          <input
            required={true}
            id="email"
            onChange={handleInputChange}
            name="email"
          />
          <span>Email</span>
          <a>{error.email}</a>
          <i></i>
        </div>
        <div className={styles.inputBox}>
          <input
            required={true}
            id="suggestions"
            onChange={handleInputChange}
            name="suggestions"
          />
          <span>Suggestions</span>
          <a>{error.suggestions}</a>
          <i></i>
        </div>
        <button onClick={sendEmail} disabled={disabled}>
          Soumettre
        </button>
      </form>
    </div>
  );
};

export default Form;
