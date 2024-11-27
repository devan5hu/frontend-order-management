import React from "react";
import { TextField } from "@mui/material";

function FormInput({ label, name, type, value, onChange, required = true }) {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      required={required}
    />
  );
}

export default FormInput;
