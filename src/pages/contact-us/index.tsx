import { ContactForm } from "../../components/Form/Contact/ContactForm";
import styles from "./Contact.module.scss"; // Ensure styles are imported correctly
import { Table } from "reactstrap";
import {Col, Container, Row} from "react-bootstrap";
import shelter_table from "@/utils/models/shelter_table";

const Contact = () => {
  const shelter_data = [
    {
      "#": 1,
      "المدينة": "دمشق",
      "المنطفة": "المزة",
      "الشارع": "شارع المدارس",
      "المبنى": "البناء 5",
      "الطابق": 2,
      "اسم صاحب المنزل": "أحمد خليل",
      "سعة المنزل": "9",
      "معلومات إضافية": "قريب من المستشفى",
      "رقم الهاتف": "0999999991",
      "الكلفة": "50000 ل.س",
      "حالة المنزل": "فارغ",
    },
    {
      "#": 2,
      "المدينة": "حلب",
      "المنطفة": "السبيل",
      "الشارع": "شارع الفرسان",
      "المبنى": "البناء 10",
      "الطابق": 3,
      "اسم صاحب المنزل": "نور الدين حسين",
      "سعة المنزل": "6",
      "معلومات إضافية": "بالقرب من الجامعة",
      "رقم الهاتف": "0999999992",
      "الكلفة": "60000 ل.س",
      "حالة المنزل": "مأهول",
    },
    {
      "#": 3,
      "المدينة": "حمص",
      "المنطفة": "كرم الزيتون",
      "الشارع": "شارع خالد بن الوليد",
      "المبنى": "البناء 20",
      "الطابق": 1,
      "اسم صاحب المنزل": "حسن محمود",
      "سعة المنزل": "5",
      "معلومات إضافية": "مطل على الحديقة",
      "رقم الهاتف": "0999999993",
      "الكلفة": "45000 ل.س",
      "حالة المنزل": "ممتلئ",
    },
    {
      "#": 4,
      "المدينة": "اللاذقية",
      "المنطفة": "الرمل الجنوبي",
      "الشارع": "شارع البحر",
      "المبنى": "البناء 15",
      "الطابق": 4,
      "اسم صاحب المنزل": "علي محمد",
      "سعة المنزل": "7",
      "معلومات إضافية": "إطلالة بحرية",
      "رقم الهاتف": "0999999994",
      "الكلفة": "70000 ل.س",
      "حالة المنزل": "فارغ",
    }
  ];

  const getRowClass = (status: string) => {
    switch (status) {
      case 'فارغ':
        return '';
      case 'مأهول':
        return styles["taken-row"];
      case 'ممتلئ': // Full
        return styles["full-row"];
      default:
        return '';
    }
  };

  return (
      <Container>
        <Row>
          <Col xl={8}>
        <h1 className={styles["titleTable"]}>الملاجئ</h1>
          </Col>
          <Col xl={4}>
            <div className="mt-4">
              <div className="d-flex align-items-center">
                <div className={`${styles['taken-row']} me-2`}
                     style={{width: '15px', height: '15px', borderRadius: '50%', marginLeft: '10px'}}></div>
                <span>مأهول</span>
              </div>
              <div className="d-flex align-items-center">
                <div className={`${styles['full-row']} me-2`}
                     style={{width: '15px', height: '15px', borderRadius: '50%', marginLeft: '10px'}}></div>
                <span>ممتلئ</span>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-2"
                     style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#f9f9f9', marginLeft: '10px'}}></div>
                <span>فارغ</span>
              </div>
            </div>
          </Col>
        </Row>
        <Table bordered hover responsive="xl" className={styles["table"]}>
          <thead>
          <tr>
            {shelter_table.map((header, index) => (
                <th key={index}>{header}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {shelter_data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
                    <td className={getRowClass(row["حالة المنزل"])} key={cellIndex}>{cellIndex === 9 ? (
                        <a href={`tel:${cell}`}>{cell}</a>
                    ) : (
                        cell
                    )}</td>
                ))}
              </tr>
          ))}
          </tbody>
        </Table>
      </Container>
  );
};

export default Contact;
