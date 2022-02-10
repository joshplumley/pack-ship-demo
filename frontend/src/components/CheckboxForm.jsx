import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const CheckboxForm = ({ onChange, label, checkBoxSx, formControlSx, checked = true }) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox sx={{ ...checkBoxSx }} checked={checked} />}
        label={label}
        onChange={onChange}
        sx={{ ...formControlSx }}
      />
    </FormGroup>
  );
};

export default CheckboxForm;
