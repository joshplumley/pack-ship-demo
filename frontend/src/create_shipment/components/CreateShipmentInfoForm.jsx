import React, { useEffect, useMemo, useState } from "react";
import {
  TextField,
  Grid,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import CarrierServiceDropdown from "../../components/CarrierServiceDropdown";
import { CARRIERS } from "../../utils/Constants";

const CreateCarrierShipmentInfoForm = ({
  shippingInfo,
  setShippingInfo,
  canErrorCheck,
  reset,
  setReset,
}) => {
  const [localShippingInfo, setLocalShippingInfo] = useState({
    ...shippingInfo,
    carrier: CARRIERS[0],
  });

  const defaultInfo = useMemo(() => {
    return {
      manifest: shippingInfo.manifest,
      customer: shippingInfo.customer,
      deliveryMethod: shippingInfo.deliveryMethod,
      carrier: CARRIERS[0],
    };
  }, [
    shippingInfo.manifest,
    shippingInfo.customer,
    shippingInfo.deliveryMethod,
  ]);

  useEffect(() => {
    if (reset) {
      setShippingInfo(defaultInfo);
      setLocalShippingInfo(defaultInfo);
      setReset(false);
    }
  }, [reset, setReset, defaultInfo, setShippingInfo]);

  return (
    <Box component="form">
      <Grid container item alignItems="center" spacing={2}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography align="right" sx={{ fontWeight: 700 }}>Carrier Service*:</Typography>
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
      <Grid container item alignItems="center" spacing={2}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography align="right" sx={{ fontWeight: 700 }}>Delivery Speed*:</Typography>
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
          <Typography align="right" sx={{ fontWeight: 700 }}>Customer Account:</Typography>
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
          <Typography align="right" sx={{ fontWeight: 700 }}>Tracking:</Typography>
        </Grid>
        <Grid item xs>
          <TextField
            required
            value={localShippingInfo.trackingNumber ?? ""}
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
      <Grid container item alignItems="center" spacing={2}>
        <Grid container item xs={5} justifyContent="flex-end">
          <Typography align="right" sx={{ fontWeight: 700 }}>Cost:</Typography>
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
