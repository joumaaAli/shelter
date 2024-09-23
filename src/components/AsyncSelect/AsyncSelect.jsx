import React from "react";
import AsyncSelect from "react-select/async";

const CustomAsyncSelect = ({
  defaultOptions,
  loadOptions,
  onChange,
  defaultValue = null,
  isMulti = false,
  value,
}) => {
  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "transparent",
      borderColor: "white",
      color: "white",
    }),
    option: (styles) => ({ ...styles, color: "#283046" }),
    input: (styles) => ({ ...styles, color: "white" }),
    placeholder: (styles) => ({ ...styles, color: "white" }),
    singleValue: (styles) => ({ ...styles, color: "white" }),
    valueContainer: (styles) => ({ ...styles, color: "white" }),
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions={defaultOptions}
      loadOptions={loadOptions}
      onChange={onChange}
      defaultValue={defaultValue}
      styles={colourStyles}
      isMulti={isMulti}
      isClearable={true}
      value={value}
    />
  );
};

export default CustomAsyncSelect;
