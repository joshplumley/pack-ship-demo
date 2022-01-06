import * as React from "react";
import Button from "@mui/material/Button";

const MakePackingSlipButton = ({ disabled = false }) => {
  return (
    <Button disabled={disabled} variant="contained">
      Make Packing Slip
    </Button>
  );
};

export default MakePackingSlipButton;
