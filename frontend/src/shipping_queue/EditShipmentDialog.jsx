import React, { useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import {
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import PackShipEditableTable from "../components/EdittableTable";
import PopupDialog from "../components/PackingDialog";
import DeleteIcon from "@mui/icons-material/Delete";

import TextInput from "../components/TextInput";
import TitleTextInput from "../components/TitleTextInput";

const useStyle = makeStyles((theme) => ({}));

const PackingSlipDrowdown = ({ params }) => {
  return (
    <div style={{ width: "100%" }}>
      <List>
        {params.id !== "add-row-id" && ( //Skip the row with the add row button
          <ListItemButton>
            {params.row.open && params.row.open !== undefined ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
            <ListItemText primary={params.row.packingSlipId} />
          </ListItemButton>
        )}
        {/* <Collapse in={params.row.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {params.row.items.map((e) => (
              <ListItem key={e._id} divider>
                <ListItemText
                  primary={`${e.item} (${e.qty !== undefined ? e.qty : "-"})`}
                />
              </ListItem>
            ))}
          </List>
        </Collapse> */}
      </List>
    </div>
  );
};

const EditShipmentTableDialog = ({
  tableData,
  isOpen,
  onClose,
  selectedOrder,
  viewOnly = true,
}) => {
  const classes = useStyle();
  const [carrierInput, setCarrierInputChange] = useState();
  const [deliverySpeed, setDeliverySpeed] = useState();
  const [customerAccount, setCustomerAccount] = useState();
  const [tracking, setTracking] = useState();
  const [cost, setCost] = useState();

  const columns = [
    {
      field: "packingSlipId",
      renderCell: (params) => {
        return <PackingSlipDrowdown params={params} />;
      },
      flex: 2,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Packing Slip</Typography>;
      },
    },
    {
      field: "part",
      flex: 2,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Part</Typography>;
      },
    },
    {
      field: "batchQty",
      flex: 2,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Batch Qty</Typography>;
      },
    },
    {
      field: "shipQty",
      flex: 2,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Ship Qty</Typography>;
      },
    },
  ];

  function onDelete() {
    console.log("Deleted"); // TODO
  }

  function onAdd() {
    console.log("Added"); // TODO
  }

  return (
    <div className={classes.root}>
      <PopupDialog
        open={isOpen}
        titleText={`Edit Shipment / ${selectedOrder.packingSlipId}`}
        onClose={onClose}
      >
        <PackShipEditableTable
          tableData={tableData}
          columns={columns}
          onDelete={onDelete}
          onAdd={onAdd}
          viewOnly={viewOnly}
        />
        <Grid container direction="row" alignItems="flex-start">
          <Grid item container xs={6} direction="column">
            <TitleTextInput
              title="Carrier Service:"
              value={carrierInput}
              viewOnly={viewOnly}
              onChange={setCarrierInputChange}
            />
            <TitleTextInput
              title="Delivery Speed:"
              value={deliverySpeed}
              viewOnly={viewOnly}
              onChange={setDeliverySpeed}
            />
            <TitleTextInput
              title="Customer Account:"
              value={customerAccount}
              viewOnly={viewOnly}
              onChange={setCustomerAccount}
            />
          </Grid>
          <Grid item container xs={6} direction="column">
            <TitleTextInput
              title="Tracking:"
              value={tracking}
              viewOnly={viewOnly}
              onChange={setTracking}
            />
            <TitleTextInput
              title="Cost:"
              value={cost}
              viewOnly={viewOnly}
              onChange={setCost}
            />
          </Grid>
        </Grid>
      </PopupDialog>
    </div>
  );
};

export default EditShipmentTableDialog;
