import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const UnfinishedBatchesCheckbox = ({ onChange, checked = true }) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        label="Show Unfinished Batches"
        onChange={onChange}
      />
    </FormGroup>
  );
};

export default UnfinishedBatchesCheckbox;
