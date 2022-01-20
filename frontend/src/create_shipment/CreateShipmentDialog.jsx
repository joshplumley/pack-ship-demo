import React, { useState } from "react";
import PackingDialog from "../components/PackingDialog";
import CreateShipmentTable from "./components/CreateShipmentTable";
import ShippingDialogStates from "./constants/ShippingDialogConstants";
import CreateCarrierShipmentInfoForm from "./components/CreateShipmentInfoForm";
import PickupDropOffForm from "./components/PickupDropOffForm";
import CommonButton from "../common/Button";
import { DialogActions, Grid } from "@mui/material";

const CreateShipmentDialog = ({
  onClose,
  open,
  currentState,
  setCurrentState,
  shippingInfo,
  setShippingInfo,
  parts,
}) => {
  const [customerName, setCustomerName] = useState("");

  // console.log(parts);

  const onPickupClick = () => {
    setCurrentState(ShippingDialogStates.PickupDropOffPage);
    setShippingInfo({ ...shippingInfo, deliveryMethod: "PICKUP" });
  };

  const onDropOffClick = () => {
    setCurrentState(ShippingDialogStates.PickupDropOffPage);
    setShippingInfo({ ...shippingInfo, deliveryMethod: "DROPOFF" });
  };

  const onCarrierClick = () => {
    setCurrentState(ShippingDialogStates.CarrierPage);
    setShippingInfo({ ...shippingInfo, deliveryMethod: "CARRIER" });
  };

  const onNextClick = () => {
    setCurrentState(ShippingDialogStates.SelectMethodPage);
  };

  const onResetClick = () => {
    setShippingInfo({
      manifest: shippingInfo.manifest,
      customer: shippingInfo.customer,
      deliveryMethod: shippingInfo.deliveryMethod,
    });
  };

  const onBackClick = () => {
    setCurrentState(ShippingDialogStates.SelectMethodPage);
    onResetClick();
  };

  const onSubmit = () => {
    console.log(shippingInfo);
  };

  const renderContents = () => {
    switch (currentState) {
      case ShippingDialogStates.SelectMethodPage:
        break;
      case ShippingDialogStates.CarrierPage:
        return (
          <CreateCarrierShipmentInfoForm
            shippingInfo={shippingInfo}
            setShippingInfo={setShippingInfo}
          />
        );
      case ShippingDialogStates.PickupDropOffPage:
        return (
          <PickupDropOffForm
            customerName={customerName}
            setCustomerName={setCustomerName}
          />
        );
      case ShippingDialogStates.CreateShipmentTable:
      default:
        return (
          <CreateShipmentTable
            rowData={parts.map((e) => {
              return {
                ...e.item,
                id: e.id,
                part: {
                  header: `${e.partNumber} - Rev${e.partRev}`,
                  description: e.partDescription,
                },
              };
            })}
          />
        );
    }
  };

  const renderDialogActions = () => {
    switch (currentState) {
      case ShippingDialogStates.SelectMethodPage:
        return (
          <DialogActions sx={{ padding: "25px" }}>
            <CommonButton onClick={onPickupClick} label="Pickup" />
            <CommonButton onClick={onDropOffClick} label="Drop Off" />
            <CommonButton onClick={onCarrierClick} label="Carrier" />
          </DialogActions>
        );
      case ShippingDialogStates.CarrierPage:
        //TODO: Implement third state
        return (
          <DialogActions sx={{ justifyContent: "normal" }}>
            <Grid container>
              <Grid item xs>
                <CommonButton onClick={onResetClick} label={"Reset"} />
              </Grid>
              <Grid container item xs justifyContent="flex-end" spacing={1}>
                <Grid item>
                  <CommonButton onClick={onClose} label="Cancel" />
                </Grid>
                <Grid item>
                  <CommonButton autoFocus onClick={onSubmit} label={"OK"} />
                </Grid>
              </Grid>
            </Grid>
          </DialogActions>
        );
      case ShippingDialogStates.PickupDropOffPage:
        return (
          <DialogActions>
            <CommonButton onClick={onBackClick} label="Back" />
            <CommonButton autoFocus onClick={onSubmit} label={"Ok"} />
          </DialogActions>
        );
      case ShippingDialogStates.CreateShipmentTable:
      default:
        return (
          <DialogActions>
            <CommonButton onClick={onClose} label="Cancel" />
            <CommonButton autoFocus onClick={onNextClick} label={"Next"} />
          </DialogActions>
        );
    }
  };

  return (
    <PackingDialog
      fullWidth={currentState === ShippingDialogStates.CreateShipmentTable}
      titleText={`Create Shipment / ${parts[0]?.item.customer}`}
      open={open}
      onClose={onClose}
      actions={renderDialogActions()}
    >
      {renderContents()}
    </PackingDialog>
  );
};

export default CreateShipmentDialog;
