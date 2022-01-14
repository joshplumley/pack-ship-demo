import * as React from "react";
import Button from "@mui/material/Button";

const CommonButton = ({ onClick, label, disabled = false, variant = "contained" }) => {
  return (
    <Button color="primary" disabled={disabled} variant={variant} onClick={onClick} >
      {label}
    </Button>
  );
};

export default CommonButton;
