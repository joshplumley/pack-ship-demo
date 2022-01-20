import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import {
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";
import PackShipEditableTable from "../components/EdittableTable";
import PopupDialog from "../components/PackingDialog";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyle = makeStyles((theme) => ({}));

const PackingSlipDrowdown = ({ params }) => {
  return (
    <div style={{ width: "100%" }}>
      <List>
        <ListItemButton>
          {params.row.open && params.row.open !== undefined ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
          <ListItemText primary={params.row.packingSlipId.split("-")[1]} />
        </ListItemButton>
        <Collapse in={params.row.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {params.row.items.map((e) => (
              <ListItem key={e._id} divider>
                <ListItemText
                  primary={`${e.item} (${e.qty !== undefined ? e.qty : "-"})`}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );
};

const EditShipmentTableDialog = ({
  tableData,
  isOpen,
  onClose,
  selectedOrder,
}) => {
  const classes = useStyle();

  const columns = [
    // {
    //   field: "actions",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <IconButton
    //         onClick={() => {
    //           console.log("DELETED");
    //         }}
    //       >
    //         <DeleteIcon />
    //       </IconButton>
    //     );
    //   },
    //   renderHeader: (params) => {
    //     return <Typography sx={{ fontWeight: 900 }}>Actions</Typography>;
    //   },
    // },
    {
      field: "packingSlipId",
      // renderCell: (params) => {
      //   return <PackingSlipDrowdown params={params} />;
      // },
      flex: 2,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Packing Slip</Typography>;
      },
    },
    // {
    //   field: "part",
    //   flex: 2,
    //   renderHeader: (params) => {
    //     return <Typography sx={{ fontWeight: 900 }}>Part</Typography>;
    //   },
    // },
    // {
    //   field: "batchQty",
    //   flex: 2,
    //   renderHeader: (params) => {
    //     return <Typography sx={{ fontWeight: 900 }}>Batch Qty</Typography>;
    //   },
    // },
    // {
    //   field: "shipQty",
    //   flex: 2,
    //   renderHeader: (params) => {
    //     return <Typography sx={{ fontWeight: 900 }}>Ship Qty</Typography>;
    //   },
    // },
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
          // isRowSelectable={(params) => {
          //   // If orders are selected, disable selecting of
          //   // other orders if the order number does not match
          //   // that if the selected order
          //   if (
          //     selectedCustomerId !== null &&
          //     selectedCustomerId !== params.row.customerId
          //   ) {
          //     return false;
          //   }
          //   return true;
          // }}
          // onSelectionModelChange={(selectionModel, _) => {
          //   onRowClick(selectionModel, tableData);
          // }}
          // onRowClick={(params) => {
          //   let tmpData = [...tableData];
          //   const tmpIndex = tmpData.findIndex((e) => {
          //     return e.id === params.id;
          //   });
          //   tmpData[tmpIndex].open = !tmpData || !tmpData[tmpIndex].open;
          //   setTableData(tmpData);
          // }}
          // selectionModel={selectionOrderIds}
          tableData={tableData}
          // rowHeight={65}
          columns={columns}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      </PopupDialog>
    </div>
  );
};

export default EditShipmentTableDialog;
