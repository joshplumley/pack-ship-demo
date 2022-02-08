import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Typography, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PackShipDataGrid from "./PackShipDataGrid";

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

const PackShipEditableTable = ({
  sx,
  columns,
  tableData,
  onDelete,
  onAdd,
  onRowClick,
  viewOnly,
  onEditRowsModelChange,
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
      <PackShipDataGrid
        rowData={newRows}
        sx={{ border: "none", height: "50vh", ...sx }}
        className={classes.table}
        disableSelectionOnClick={true}
        onRowClick={onRowClick}
        rows={newRows}
        rowHeight={65}
        columns={newColumns}
        pageSize={localPageSize}
        rowsPerPageOptions={[localPageSize]}
        checkboxSelection={false}
        onEditRowsModelChange={onEditRowsModelChange}
        sort={{
          field: "actions",
          sort: "asc",
        }}
        hideFooter
      />
    </div>
  );
};

export default PackShipEditableTable;
