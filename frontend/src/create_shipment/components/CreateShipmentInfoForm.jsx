import React, { useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { checkCostError } from "../../utils/NumberValidators";
import CarrierServiceDropdown from "../../components/CarrierServiceDropdown";

const CreateCarrierShipmentInfoForm = ({
  shippingInfo,
  setShippingInfo,
  canErrorCheck,
}) => {
  const carriers = ["-----", "UPS", "FedEx", "Freight", "Other"];
  const [localShippingInfo, setLocalShippingInfo] = useState({
    ...shippingInfo,
    carrier: carriers[0],
  });
  const [hasSelectError, setHasSelectError] = useState(true);

  return (
    <Box component="form">
      <Grid container item alignItems="center" spacing={4}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography>Carrier Service:</Typography>
        </Grid>
        <CarrierServiceDropdown
          carrier={localShippingInfo?.carrier}
          setCarrier={(value) => {
            setShippingInfo({
              ...localShippingInfo,
              carrier: value,
            });
            setLocalShippingInfo({
              ...localShippingInfo,
              carrier: value,
            });
          }}
          canErrorCheck={canErrorCheck}
        />
      </Grid>
      <Grid container item alignItems="center" spacing={4}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography>Delivery Speed:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.deliverySpeed}
            error={
              canErrorCheck &&
              (localShippingInfo.deliverySpeed === undefined ||
                localShippingInfo.deliverySpeed === "")
            }
            helperText={
              !canErrorCheck
                ? undefined
                : localShippingInfo.deliverySpeed &&
                  localShippingInfo.deliverySpeed !== ""
                ? undefined
                : "Value must not be blank"
            }
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
                trackingNumber: event.target.value,
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
            error={canErrorCheck && checkCostError(localShippingInfo)}
            helperText={canErrorCheck && checkCostError(localShippingInfo)}
            value={localShippingInfo.cost}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{"$"}</InputAdornment>
              ),
            }}
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
