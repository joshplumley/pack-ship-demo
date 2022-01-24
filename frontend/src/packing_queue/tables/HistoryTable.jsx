import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import ContextMenu from "../../components/GenericContextMenu"
import MenuItem from '@mui/material/MenuItem';
import DeleteAlert from "./DeleteMenu"
import PackingSlipDialog from "../../packing_slip/PackingSlipDialog";


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
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewPackingSlip, setViewPackingSlip] = useState(false)

  const openDeleteDialog = (event) => {
      setDeleteDialog(true)
      setMenuPosition(null)
  }

  const openViewPackingSlip = () => {
    setViewPackingSlip(true)
    setMenuPosition(null)
  }

  const onPackingSlipClose = () => {
    setViewPackingSlip(false)
  }

  const historyRowMenuOptions = [
    <MenuItem onClick={openViewPackingSlip}>View</MenuItem>,
    <MenuItem>Download</MenuItem>,
    <MenuItem>Edit</MenuItem>,
    <MenuItem onClick={openDeleteDialog}>Delete</MenuItem>
  ];

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
      <ContextMenu menuPosition={menuPosition} setMenuPosition={setMenuPosition}>
        {historyRowMenuOptions}
      </ContextMenu>
      <PackingSlipDialog
        open={viewPackingSlip}
        onClose={onPackingSlipClose}
        orderNum="ABC456"
        parts={[{batchQty: 10, fulfilledQty: 0, id: "abcdef76886", orderNumber: "ABC456", part: "AB-123", partDescription:"Zach's Dummy Part"}]}
        viewOnly={true}
      />
      <DeleteAlert deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog}/>
    </div>
  );
};

export default HistoryTable;
