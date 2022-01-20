import { Box, Grid, Typography, TextField } from "@mui/material";
import HelpTooltip from "../../components/HelpTooltip";

const PickupDropOffForm = ({ customerName, setCustomerName }) => {
  return (
    <Box component="form">
      <Grid container item alignItems="center" spacing={4}>
        <Grid container item xs={5} justifyContent="flex-end">
          <HelpTooltip tooltipText="Enter the name of the person you are handing off this delivery to." />
          <Typography sx={{ fontWeight: 900 }}>Customer Name</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={customerName}
            onChange={(event) => {
              setCustomerName(event.target.value);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PickupDropOffForm;
