import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const PackSkipCheckbox = ({
  label,
  onChange,
  checked = true,
  disabled = false,
}) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        label={label}
        onChange={(_, checked) => onChange(checked)}
        disabled={disabled}
      />
    </FormGroup>
  );
};

export default PackSkipCheckbox;
