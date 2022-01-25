import React, { useState } from "react";
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { isCarrierValid } from "../utils/Validators";
import { CARRIERS } from "../utils/Constants";

const CarrierServiceDropdown = ({
  carrier,
  setCarrier,
  canErrorCheck,
  disabled = false,
}) => {
  const [localCarrier, setLocalCarrier] = useState(carrier);
  const [hasSelectError, setHasSelectError] = useState(false);

  return (
    <Grid item xs>
      <FormControl
        sx={{ width: "100%" }}
        error={canErrorCheck && hasSelectError}
      >
        <Select
          disabled={disabled}
          required
          error={canErrorCheck && hasSelectError}
          sx={{ width: "100%" }}
          value={localCarrier}
          onChange={(event) => {
            setHasSelectError(!isCarrierValid(event.target.value));
            setLocalCarrier(event.target.value);
          }}
          onBlur={() => {
            setCarrier(localCarrier);
          }}
        >
          {CARRIERS.map((carrier) => (
            <MenuItem key={carrier} value={carrier}>
              {carrier}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText
          error={canErrorCheck && hasSelectError}
          sx={{ display: hasSelectError ? "block" : "none" }}
        >
          {canErrorCheck && hasSelectError
            ? "Must select non-default carrier"
            : undefined}
        </FormHelperText>
      </FormControl>
    </Grid>
  );
};
export default CarrierServiceDropdown;
