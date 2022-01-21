import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";

const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "fit-content",
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
      },
  },
}));

const ThisDataGrid = styled(DataGrid)`
  .MuiDataGrid-row {
    max-height: fit-content !important;
  }

  .MuiDataGrid-renderingZone {
    max-height: none !important;
  }

  .MuiDataGrid-cell {
    max-height: fit-content !important;
    overflow: auto;
    height: auto;
    line-height: none !important;
    align-items: center;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }
`;

const ShippingHistoryTable = ({
  tableData,
  onPageChange,
  rowCount,
  perPageCount,
  onRowClick,
}) => {
  const classes = useStyle();

  const columns = [
    {
      field: "shipmentId",
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Shipping ID</Typography>;
      },
    },
    {
      field: "trackingNumber",
      flex: 2,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Tracking #</Typography>;
      },
    },
    {
      field: "dateCreated",
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Date Created</Typography>;
      },
    },
  ];

  return (
    <div className={classes.root}>
      <ThisDataGrid
        paginationMode="server"
        onPageChange={(page, _) => onPageChange(page)}
        rowCount={rowCount}
        sx={{ border: "none", height: "65vh" }}
        className={classes.table}
        disableSelectionOnClick={true}
        rows={tableData}
        rowHeight={65}
        columns={columns}
        pageSize={perPageCount}
        rowsPerPageOptions={[10]}
        checkboxSelection={false}
        editMode="row"
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default ShippingHistoryTable;
