import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const PackSkipCheckbox = ({ label, onChange, checked = true }) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        label={label}
        onChange={onChange}
      />
    </FormGroup>
  );
};

export default PackSkipCheckbox;
