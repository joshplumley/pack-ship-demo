import React from "react";
import { Typography, Grid } from "@mui/material";
import TitleTextInput from "../components/TitleTextInput";
import CarrierServiceDropdown from "../components/CarrierServiceDropdown";
import { isDeliverySpeedValid } from "../utils/Validators";

const ShipmentDetails = ({
  canErrorCheck,
  shipment,
  onCarrierInputChange,
  onDeliverySpeedChange,
  onCustomerAccountChange,
  onCustomerNameChange,
  onTrackingChange,
  onCostChange,
  viewOnly = true,
}) => {
  return (
    <div>
      {(() => {
        switch (shipment?.deliveryMethod) {
          case "CARRIER":
            return (
              <Grid container direction="row" alignItems="flex-start">
                <Grid item container xs={6} direction="column">
                  <Grid
                    item
                    container
                    direction="row"
                    alignItems="center"
                    spacing={5}
                  >
                    <Grid item container xs={3} justifyContent="flex-end">
                      <Typography sx={{ fontWeight: 900 }}>
                        {"Carrier Service:"}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <CarrierServiceDropdown
                        canErrorCheck={canErrorCheck}
                        carrier={shipment?.carrier}
                        setCarrier={onCarrierInputChange}
                        disabled={viewOnly}
                      />
                    </Grid>
                  </Grid>

                  <TitleTextInput
                    title="Delivery Speed:"
                    value={shipment?.deliverySpeed}
                    viewOnly={viewOnly}
                    onChange={onDeliverySpeedChange}
                    error={!isDeliverySpeedValid(shipment?.deliverySpeed)}
                    canErrorCheck={canErrorCheck}
                  />
                  <TitleTextInput
                    title="Customer Account:"
                    value={shipment?.customerAccount}
                    viewOnly={viewOnly}
                    onChange={onCustomerAccountChange}
                  />
                </Grid>
                <Grid item container xs={6} direction="column">
                  <TitleTextInput
                    title="Tracking:"
                    value={shipment?.trackingNumber}
                    viewOnly={viewOnly}
                    onChange={onTrackingChange}
                  />
                  <TitleTextInput
                    title="Cost:"
                    value={shipment?.cost}
                    viewOnly={viewOnly}
                    onChange={onCostChange}
                  />
                </Grid>
              </Grid>
            );
          case "DROPOFF":
          case "PICKUP":
          default:
            return (
              <TitleTextInput
                title="Customer Name:"
                value={shipment?.customerHandoffName}
                viewOnly={viewOnly}
                onChange={onCustomerNameChange}
              />
            );
        }
      })()}
    </div>
  );
};

export default ShipmentDetails;
