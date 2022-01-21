import * as React from "react";
import Button from "@mui/material/Button";

const CommonButton = ({
  onClick,
  label,
  disabled = false,
  variant = "contained",
  autoFocus = false,
  color = "primary",
}) => {
  return (
    <Button
      color={color}
      disabled={disabled}
      variant={variant}
      onClick={onClick}
      autoFocus={autoFocus}
    >
      {label}
    </Button>
  );
};

export default CommonButton;
