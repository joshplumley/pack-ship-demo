import * as React from "react";
import Button from "@mui/material/Button";

const CommonButton = ({ label, disabled = false, variant = "contained" }) => {
  return (
    <Button color="secondary" disabled={disabled} variant={variant}>
      {label}
    </Button>
  );
};

export default CommonButton;
