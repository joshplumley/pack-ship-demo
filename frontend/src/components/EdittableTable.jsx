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
  onRowClick,
  viewOnly,
  pageSize = 10,
}) => {
  const classes = useStyle();
  const addRowId = "add-row-id";
  let newColumns = columns;
  let newRows = tableData;

  // Add the delete action column if not view only
  if (!viewOnly) {
    const deleteCol = [
      {
        field: "actions",
        flex: 1,
        renderCell: (params) => {
          return params.id === addRowId ? (
            <IconButton onClick={() => onAdd(tableData)}>
              <AddCircleOutlineIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => onDelete(params)}>
              <DeleteIcon />
            </IconButton>
          );
        },
        renderHeader: (params) => {
          return <Typography sx={{ fontWeight: 900 }}>Actions</Typography>;
        },
      },
    ];
    newColumns = deleteCol.concat(columns);

    // Add row for the ability to add a new row
    newRows = [];
    tableData?.forEach((e, i) => {
      newRows.push(e);
      // make sure the add Row is at the end of the page and at the end of the
      // last page
      if (
        (i % (pageSize - 2) === 0 && i !== 0) ||
        i === tableData?.length - 1
      ) {
        newRows.push({ id: addRowId });
      }
    });
    // no data add the add row
    if (tableData?.length === 0) {
      newRows.push({ id: addRowId });
    }
  }

  return (
    <div className={classes.root}>
      <ThisDataGrid
        sx={{ border: "none" }}
        className={classes.table}
        autoHeight
        disableSelectionOnClick={true}
        onRowClick={onRowClick}
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
