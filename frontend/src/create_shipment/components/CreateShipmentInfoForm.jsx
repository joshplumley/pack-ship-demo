import React, { useState } from "react";

import {
  TextField,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
} from "@mui/material";

const CreateCarrierShipmentInfoForm = ({ shippingInfo, setShippingInfo }) => {
  const carriers = ["----", "UPS", "FedEx", "Freight", "Other"];
  const [localShippingInfo, setLocalShippingInfo] = useState(shippingInfo);

  return (
    <Box component="form">
      <Grid container item alignItems="center" spacing={4}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography>Carrier Service:</Typography>
        </Grid>
        <Grid item xs>
          <Select
            required
            sx={{ width: "100%" }}
            value={localShippingInfo.carrier}
            onChange={(event) => {
              setLocalShippingInfo({
                ...localShippingInfo,
                carrier: event.target.value,
              });
            }}
            onBlur={() => {
              setShippingInfo(localShippingInfo);
            }}
          >
            {carriers.map((carrier) => (
              <MenuItem key={carrier} value={carrier}>
                {carrier}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Grid container item alignItems="center" spacing={4}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography>Delivery Speed:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.deliverySpeed}
            onChange={(event) => {
              setLocalShippingInfo({
                ...localShippingInfo,
                deliverySpeed: event.target.value,
              });
            }}
            onBlur={() => {
              setShippingInfo({ ...localShippingInfo });
            }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        spacing={4}
        sx={{ paddingBottom: "20px" }}
      >
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography>Customer Account:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.customerAccount}
            onChange={(event) => {
              setLocalShippingInfo({
                ...localShippingInfo,
                customerAccount: event.target.value,
              });
            }}
            onBlur={() => {
              setShippingInfo(localShippingInfo);
            }}
          />
        </Grid>
      </Grid>
      <Grid container item alignItems="center" spacing={4}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography sx={{ fontWeight: 700 }}>Tracking:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.tracking}
            onChange={(event) => {
              setLocalShippingInfo({
                ...localShippingInfo,
                tracking: event.target.value,
              });
            }}
            onBlur={() => {
              setShippingInfo(localShippingInfo);
            }}
          />
        </Grid>
      </Grid>
      <Grid container item alignItems="center" spacing={4}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography sx={{ fontWeight: 700 }}>Cost:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.cost}
            onChange={(event) => {
              setLocalShippingInfo({
                ...localShippingInfo,
                cost: event.target.value,
              });
            }}
            onBlur={() => {
              setShippingInfo(localShippingInfo);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateCarrierShipmentInfoForm;
