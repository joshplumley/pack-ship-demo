import React from "react";
import { TextField } from "@mui/material";

const TextInput = ({ onChange, placeholder, value }) => {
  return (
    <TextField
      id="text-field-input"
      onChange={(e) => {
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      value={value}
      variant="outlined"
    />
  );
};

export default TextInput;
