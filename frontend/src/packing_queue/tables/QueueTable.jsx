import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
import { Tooltip, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  fulfilledQtyHeader: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  help: {
    paddingLeft: "10px",
  },
  table: {
    backgroundColor: "white",
    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
      {
        display: "none",
        // "&:after": { content: "Select" },
      },
  },
}));

const QueueTable = ({ tableData, onRowClick, selectedOrderNumber }) => {
  const classes = useStyle();

  const columns = [
    {
      field: "orderNumber",
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Order</Typography>;
      },
    },
    {
      field: "part",
      renderCell: (params) => (
        <div>
          <Typography>{params.row.part}</Typography>
          <Typography color="textSecondary">
            {params.row.partDescription}
          </Typography>
        </div>
      ),
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Part</Typography>;
      },
    },
    {
      field: "batchQty",
      type: "number",
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Batch Qty</Typography>;
      },
    },
    {
      field: "fulfilledQty",
      type: "number",
      renderHeader: (params) => {
        return (
          <div className={classes.fulfilledQtyHeader}>
            <Typography sx={{ fontWeight: 900 }}>Fulfilled Qty</Typography>
            <Tooltip title="This includes number of items that have been packed as well as number of items that have shipped.">
              <HelpOutlineIcon className={classes.help} />
            </Tooltip>
          </div>
        );
      },
      flex: 1,
    },
  ];

  return (
    <div className={classes.root}>
      <DataGrid
        sx={{ border: "none" }}
        className={classes.table}
        autoHeight
        disableSelectionOnClick={false}
        isRowSelectable={(params) => {
          // If orders are selected, disable selecting of
          // other orders if the order number does not match
          // that if the selected order
          if (
            selectedOrderNumber !== null &&
            selectedOrderNumber !== params.row.orderNumber
          ) {
            return false;
          }
          return true;
        }}
        onSelectionModelChange={(selectionModel, _) => {
          onRowClick(selectionModel, tableData);
        }}
        rows={tableData}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
      />
    </div>
  );
};

export default QueueTable;
