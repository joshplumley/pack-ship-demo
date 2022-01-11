import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const PackShipDataGrid = ({ validateError, rowData, columns }) => {
  return (
    <Box
      sx={{
        height: 400,
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
      <DataGrid
        autoHeight
        rows={rowData}
        columns={columns}
        onCellEditCommit={validateError}
      />
    </Box>
  );
};

export default PackShipDataGrid;
