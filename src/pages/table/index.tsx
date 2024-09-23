import SearchForm from "@/components/Form/Auth/SearchForm";
import React from "react";
import { Card } from "react-bootstrap";

const TablePage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center flex-column gap-2">
      <SearchForm />
    </div>
  );
};

export default TablePage;
