import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import {
  Typography,
  List,
  ListItemText,
  ListItemButton,
  Grid,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PackShipEditableTable from "../components/EdittableTable";
import PopupDialog from "../components/PackingDialog";
import TitleTextInput from "../components/TitleTextInput";
import CarrierServiceDropdown from "../components/CarrierServiceDropdown";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";

const useStyle = makeStyles((theme) => ({}));

const PackingSlipDrowdown = ({ params, packingSlipId, manifest }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <List>
        <ListItemButton
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isOpen ? <ExpandLess /> : <ExpandMore />}
          <ListItemText primary={packingSlipId} />
        </ListItemButton>
        {isOpen && (
          <DataGrid
            pageSize={10}
            rowsPerPageOptions={[10]}
            autoHeight
            rows={manifest
              .find((e) => e._id === params.id)
              ?.items.map((e) => {
                return {
                  id: e.item._id,
                  part: e.item,
                  batchQty: e.item.batch,
                  shipQty: e.item.quantity,
                };
              })}
            columns={[
              {
                field: "part",
                flex: 2,
                renderHeader: (params) => {
                  return <Typography sx={{ fontWeight: 900 }}>Part</Typography>;
                },
                renderCell: (params) => {
                  const item = params.row.part;
                  return (
                    <div>
                      <Typography>{`${item.partNumber} - ${item.partRev}`}</Typography>
                      <Typography color="textSecondary">
                        {item.partDescription}
                      </Typography>
                    </div>
                  );
                },
              },
              {
                field: "batchQty",
                flex: 2,
                renderHeader: (params) => {
                  return (
                    <Typography sx={{ fontWeight: 900 }}>Batch Qty</Typography>
                  );
                },
              },
              {
                field: "shipQty",
                flex: 2,
                renderHeader: (params) => {
                  return (
                    <Typography sx={{ fontWeight: 900 }}>Ship Qty</Typography>
                  );
                },
              },
            ]}
          />
        )}
      </List>
    </div>
  );
};

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
          tableData={shipment?.manifest.map((e) => {
            return { id: e._id, packingSlipId: e.packingSlipId };
          })}
          columns={columns}
          onDelete={onDelete}
          onAdd={onAdd}
          viewOnly={viewOnly}
        />
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
                  carrier={shipment?.carrier}
                  setCarrier={onCarrierInputChange}
                  canErrorCheck={false}
                  disabled={viewOnly}
                />
              </Grid>
            </Grid>

            <TitleTextInput
              title="Delivery Speed:"
              value={shipment?.deliverySpeed}
              viewOnly={viewOnly}
              onChange={onDeliverySpeedChange}
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
      </PopupDialog>
    </div>
  );
};

export default EditShipmentTableDialog;
