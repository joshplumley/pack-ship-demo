import React from "react";
import { Select, MenuItem } from "@mui/material";

const EditTableDropdown = ({ choices, onChange, value }) => {
  return (
    <Select
      required
      value={value.packingSlipId}
      onChange={(event) => {
        onChange(choices.find((e) => e.packingSlipId === event.target.value));
      }}
    >
      {choices.map((e) => {
        return (
          <MenuItem key={e.packingSlipId} value={e.packingSlipId}>
            {e.packingSlipId}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default EditTableDropdown;
