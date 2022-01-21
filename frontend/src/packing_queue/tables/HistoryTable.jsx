import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "orderId", headerName: "Order", width: 200 },
  {
    field: "packingSlipN",
    headerName: "Packing Slip #",
    type: "number",
    width: 350,
  },
  { field: "dateCreated", headerName: "Date Created", width: 150 },
];

// TODO REPLACE FAKE DATA
const rows = [
  {
    id: 1,
    orderId: "ABC1001",
    packingSlipN: 1,
    dateCreated: "10/23/2021",
  },
];

const HistoryTable = () => {
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        sx={{ border: "none", height: "65vh" }}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
      />
    </div>
  );
};

export default HistoryTable;
