import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, IconButton } from "@mui/material";
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

  // const [localPageSize, setLocalPageSize] = useState(pageSize);
  let newColumns = columns;
  let newRows = tableData;
  let localPageSize = pageSize;

  // Add the delete action column if not view only
  if (!viewOnly) {
    const deleteCol = [
      {
        field: "actions",
        flex: 1,
        renderCell: (params) => {
          return params.id.includes(addRowId) ? (
            <IconButton onClick={() => onAdd(params.row.pageNum)}>
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
        sortable: false,
      },
    ];
    newColumns = deleteCol.concat(columns);

    // Add row for the ability to add a new row
    newRows = [...tableData];
    newRows.push({
      id: addRowId,
    });
    localPageSize = newRows.length;
  }

  return (
    <div className={classes.root}>
      <ThisDataGrid
        sx={{ border: "none", height: "50vh" }}
        className={classes.table}
        disableSelectionOnClick={true}
        onRowClick={onRowClick}
        rows={newRows}
        rowHeight={65}
        columns={newColumns}
        pageSize={localPageSize}
        rowsPerPageOptions={[10]}
        checkboxSelection={false}
        editMode="row"
        sort={{
          field: "actions",
          sort: "asc",
        }}
      />
    </div>
  );
};

export default PackShipEditableTable;
