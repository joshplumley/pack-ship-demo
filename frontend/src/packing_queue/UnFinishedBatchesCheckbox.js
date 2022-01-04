import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";


const UnfinishedBatchesCheckbox = () => {

  return (
    <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Show Unfinished Batches" />
    </FormGroup>
  )

};

export default UnfinishedBatchesCheckbox;