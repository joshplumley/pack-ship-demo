import React, { useEffect, useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputAdornment,
} from "@mui/material";

const CreateCarrierShipmentInfoForm = ({
  shippingInfo,
  setShippingInfo,
  canErrorCheck,
  reset,
  setReset,
}) => {
  const carriers = ["-----", "UPS", "FedEx", "Freight", "Other"];
  const [localShippingInfo, setLocalShippingInfo] = useState({
    ...shippingInfo,
    carrier: carriers[0],
  });
  const [hasSelectError, setHasSelectError] = useState(true);

  const defaultInfo = {
    manifest: shippingInfo.manifest,
    customer: shippingInfo.customer,
    deliveryMethod: shippingInfo.deliveryMethod,
    carrier: carriers[0],
  };

  useEffect(() => {
    if (reset) {
      setShippingInfo(defaultInfo);
      setLocalShippingInfo(defaultInfo);
      setReset(false);
      setHasSelectError(true);
    }
  }, [reset, setReset, defaultInfo]);

  return (
    <Box component="form">
      <Grid container item alignItems="center" spacing={2}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography sx={{ fontWeight: 700 }}>Carrier Service*:</Typography>
        </Grid>
        <Grid item xs>
          <FormControl
            sx={{ width: "100%" }}
            error={canErrorCheck && hasSelectError}
          >
            <Select
              required
              error={canErrorCheck && hasSelectError}
              sx={{ width: "100%" }}
              value={localShippingInfo.carrier}
              onChange={(event) => {
                setHasSelectError(event.target.value === carriers[0]);
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
            <FormHelperText
              error={canErrorCheck && hasSelectError}
              sx={{
                display: canErrorCheck && hasSelectError ? "block" : "none",
              }}
            >
              {canErrorCheck && hasSelectError
                ? "Must select non-default carrier"
                : undefined}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container item alignItems="center" spacing={2}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography sx={{ fontWeight: 700 }}>Delivery Speed*:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.deliverySpeed ?? ""}
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
        spacing={2}
        sx={{ paddingBottom: "20px" }}
      >
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography sx={{ fontWeight: 700 }}>Customer Account:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.customerAccount ?? ""}
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
      <Grid container item alignItems="center" spacing={2}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography sx={{ fontWeight: 700 }}>Tracking:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.tracking ?? ""}
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
      <Grid container item alignItems="center" spacing={2}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography sx={{ fontWeight: 700 }}>Cost:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.cost ?? ""}
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
