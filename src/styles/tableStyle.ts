import {TableStyles} from "react-data-table-component";

const tableStyle: TableStyles = {
    headRow: {
        style: {
            border: "none",
            color: "#223336",
            backgroundColor: "#f8f9fa",
        },
    },
    rows: {
        style: {
            border: "none !important",
            backgroundColor: "transparent",
            "&:nth-child(even)": {
                backgroundColor: "#f1f3f5",
            },
            "&:hover": {
                backgroundColor: "#e9ecef",
            },
        },
    },
    cells: {
        style: {
            paddingLeft: "16px",
            paddingRight: "16px",
            fontSize: "14px",
            color: "#343a40",
        },
    },
    noData: {
        style: {
            color: "#6c757d",
            fontSize: "16px",
            textAlign: "center",
            padding: "20px 0",
        },
    },
    pagination: {
        style: {
            boxShadow: "0 2px 2px rgba(0, 0, 0, 0.07)",
            backgroundColor: "#fff",
            borderTop: "none",
            borderRadius: "10px",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        pageButtonsStyle: {
            width: "40px",
            height: "40px",
            borderRadius: "6px",
            padding: "5px",
            margin: "0 5px",
            cursor: "pointer",
            backgroundColor: "#599a68",
            color: "#fff",
            transition: "background-color 0.3s ease",

            "&:hover:not(:disabled)": {
                backgroundColor: "#3b6645",
            },

            "&:disabled": {
                backgroundColor: "#e0e0e0",
                cursor: "not-allowed",
            },
        },
    },
};

export default tableStyle;