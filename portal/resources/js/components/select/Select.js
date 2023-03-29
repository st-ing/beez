import React from "react";
import Select from "react-select";
export const PrimarySelect = ({classNamePrefix, name, id, value, onChange, options})  => {
  return (

    <Select  classNamePrefix={classNamePrefix}
      styles={{
      control: (provided,state) => ({
        ...provided,
        backgroundColor:  "rgba(240, 240, 248, 0.4)",
        borderColor: state.isFocused ? "#958BEF" : "rgba(61, 64, 91, 0.15)",
        boxShadow: state.isFocused ? "0 0 0 0.2rem #CCC7F6" : 0,
        "&:hover": {
        borderColor: state.isFocused ? "#958BEF" : "rgba(61, 64, 91, 0.15)"
        }
      }),
      menu: provided => ({ ...provided, zIndex: 9999  }),
      option: (styles,data) => ({
        ...styles,  color: data.value === null ? 'transparent' : "styles.color" ,
        "&:hover": {
          backgroundColor: "#F0F0F8"
        },
        backgroundColor: data.isSelected ? '#F6BD60' : 'transparent'

      }),

      singleValue: (styles, { data }) => ({
        ...styles, color: data.value === null ? 'transparent' : "styles.color"
      }),
    }}
      name={name} value={value} onChange={onChange} options={options} id={id}
    />

  );
}
export default PrimarySelect
