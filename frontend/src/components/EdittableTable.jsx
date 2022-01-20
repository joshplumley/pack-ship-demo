import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
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
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
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

const PackShipEditableTable = ({
  columns,
  tableData,
  onDelete,
  onAdd,
  setTableData,
  onRowClick,
  selectedCustomerId,
  selectionOrderIds,
  pageSize = 10,
}) => {
  const classes = useStyle();
  const addRowId = "add-row-id";

  // Add the delete action column
  const deleteCol = [
    {
      field: "actions",
      flex: 1,
      renderCell: (params) => {
        return params.id === addRowId ? (
          <IconButton onClick={onAdd}>
            <AddCircleOutlineIcon />
          </IconButton>
        ) : (
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        );
      },
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Actions</Typography>;
      },
    },
  ];
  const newColumns = deleteCol.concat(columns);

  // Add row for the ability to add a new row
  let newRows = [];
  tableData.forEach((e, i) => {
    newRows.push(e);
    // make sure the add Row is at the end of the page and at the end of the
    // last page
    if ((i % (pageSize - 2) === 0 && i !== 0) || i === tableData.length - 1) {
      newRows.push({ id: addRowId });
    }
  });

  return (
    <div className={classes.root}>
      <ThisDataGrid
        sx={{ border: "none" }}
        className={classes.table}
        autoHeight
        disableSelectionOnClick={true}
        isRowSelectable={(params) => {
          // If orders are selected, disable selecting of
          // other orders if the order number does not match
          // that if the selected order
          if (
            selectedCustomerId !== null &&
            selectedCustomerId !== params.row.customerId
          ) {
            return false;
          }
          return true;
        }}
        onSelectionModelChange={(selectionModel, _) => {
          onRowClick(selectionModel, tableData);
        }}
        onRowClick={(params) => {
          let tmpData = [...tableData];
          const tmpIndex = tmpData.findIndex((e) => {
            return e.id === params.id;
          });
          tmpData[tmpIndex].open = !tmpData || !tmpData[tmpIndex].open;
          setTableData(tmpData);
        }}
        selectionModel={selectionOrderIds}
        rows={newRows}
        rowHeight={65}
        columns={newColumns}
        pageSize={pageSize}
        rowsPerPageOptions={[10]}
        checkboxSelection={false}
        editMode="row"
      />
    </div>
  );
};

export default PackShipEditableTable;
