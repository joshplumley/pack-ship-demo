import { DataGrid } from "@mui/x-data-grid";
import HistoryRowContextMenu from "./HistoryContextMenu";
import React, { useState } from "react";

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
  const [menuPosition, setMenuPosition] = useState(null);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        onRowClick={(params, event, details) => {
          setMenuPosition({left: event.pageX, top: event.pageY})
        }}
      />
      <HistoryRowContextMenu menuPosition={menuPosition} setMenuPosition={setMenuPosition}/>
    </div>
  );
};

export default HistoryTable;
