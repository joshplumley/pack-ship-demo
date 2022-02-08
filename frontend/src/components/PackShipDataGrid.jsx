import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";

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

const PackShipDataGrid = ({
  rowData,
  columns,
  sx,
  className,
  disableSelectionOnClick,
  onRowClick,
  rowHeight,
  pageSize,
  rowsPerPageOptions,
  checkboxSelection,
  editMode,
  sort,
  onEditRowsModelChange,
  hideFooter,
}) => {
  return (
    <Box
      sx={{
        height: "fit-content",
        width: 1,
        "& .MuiDataGrid-cell--editing": {
          bgcolor: "rgb(255,215,115, 0.19)",
          color: "#1a3e72",
        },
        "& .Mui-error": {
          bgcolor: (theme) =>
            `rgb(126,10,15, ${theme.palette.mode === "dark" ? 0 : 0.1})`,
          color: (theme) =>
            theme.palette.mode === "dark" ? "#ff4343" : "#750f0f",
        },
      }}
    >
      <ThisDataGrid
        rows={rowData}
        columns={columns}
        onEditRowsModelChange={onEditRowsModelChange}
        sx={{
          ...sx,
        }}
        className={className}
        disableSelectionOnClick={disableSelectionOnClick}
        onRowClick={onRowClick}
        rowHeight={rowHeight}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        checkboxSelection={checkboxSelection}
        editMode={editMode}
        sort={sort}
        hideFooter={hideFooter}
      />
    </Box>
  );
};

export default PackShipDataGrid;
