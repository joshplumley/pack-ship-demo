import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const TextInput = ({ onChange, placeholder }) => {
  return (
    <TextField
      id="text-field-input"
      onChange={(e) => {
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      variant="outlined"
    />
  );
};

export default TextInput;
