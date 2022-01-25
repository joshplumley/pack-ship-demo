import React from "react";
import { TextField } from "@mui/material";

const TextInput = ({
  onChange,
  placeholder,
  value,
  readOnly = false,
  error = false,
  canErrorCheck = false,
}) => {
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
      error={canErrorCheck && error}
      helperText={
        canErrorCheck && error ? "Value must not be blank" : undefined
      }
    />
  );
};

export default TextInput;
