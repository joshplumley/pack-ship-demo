import React from "react";
import { TextField } from "@mui/material";

const TextInput = ({ onChange, placeholder, value, readOnly = false }) => {
  return (
    <TextField
      id="text-field-input"
      onChange={(e) => {
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      value={value}
      variant="outlined"
      inputProps={{ readOnly }}
    />
  );
};

export default TextInput;
