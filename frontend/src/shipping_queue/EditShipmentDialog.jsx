import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";
import PackShipEditableTable from "../components/EdittableTable";
import PopupDialog from "../components/PackingDialog";
import PackingSlipDrowdown from "./PackingSlipDropdown";
import ShipmentDetails from "./ShipmentDetails";

const useStyle = makeStyles((theme) => ({}));

const EditShipmentTableDialog = ({
  shipment,
  isOpen,
  onClose,
  onSubmit,
  onAdd,
  onDelete,
  onCarrierInputChange,
  onDeliverySpeedChange,
  onCustomerAccountChange,
  onCustomerNameChange,
  onTrackingChange,
  onCostChange,
  viewOnly = true,
}) => {
  const classes = useStyle();
  const columns = [
    {
      field: "packingSlipId",
      renderCell: (params) => {
        return (
          params.id !== "add-row-id" && (
            <PackingSlipDrowdown
              params={params}
              packingSlipId={params.row.packingSlipId}
              manifest={shipment.manifest}
            />
          )
        );
      },
      flex: 2,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Packing Slip</Typography>;
      },
    },
  ];

  return (
    <div className={classes.root}>
      <PopupDialog
        open={isOpen}
        titleText={`Edit Shipment / ${shipment?.shipmentId}`}
        onClose={onClose}
        onSubmit={onSubmit}
      >
        <PackShipEditableTable
          tableData={shipment?.manifest?.map((e) => {
            return { id: e._id, packingSlipId: e.packingSlipId };
          })}
          columns={columns}
          onDelete={onDelete}
          onAdd={onAdd}
          viewOnly={viewOnly}
        />
        <ShipmentDetails
          shipment={shipment}
          onCarrierInputChange={onCarrierInputChange}
          onDeliverySpeedChange={onDeliverySpeedChange}
          onCustomerAccountChange={onCustomerAccountChange}
          onCustomerNameChange={onCustomerNameChange}
          onTrackingChange={onTrackingChange}
          onCostChange={onCostChange}
          viewOnly={viewOnly}
        />
      </PopupDialog>
    </div>
  );
};

export default EditShipmentTableDialog;
