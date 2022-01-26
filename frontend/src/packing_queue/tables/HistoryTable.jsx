import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import ContextMenu from "../../components/GenericContextMenu"
import MenuItem from '@mui/material/MenuItem';
import DeleteAlert from "./DeleteMenu"
import PackingSlipDialog from "../../packing_slip/PackingSlipDialog";
import { API } from "../../services/server";

const columns = [
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
  {
    id: "61f0a50e202d7891ce25626c",
    orderId: "GHI2002",
    packingSlipN: 1,
    dateCreated: "1/1/2022"
  }
];

const HistoryTable = () => {
  const [menuPosition, setMenuPosition] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewPackingSlip, setViewPackingSlip] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

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

  const onDeleteConfirm = () => {

  }

  const historyRowMenuOptions = [
    <MenuItem onClick={openViewPackingSlip}>View</MenuItem>,
    <MenuItem>Download</MenuItem>,
    <MenuItem>Edit</MenuItem>,
    <MenuItem onClick={openDeleteDialog}>Delete</MenuItem>
  ];

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        sx={{ border: "none", height: "65vh" }}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        onRowClick={(params, event, details) => {
          console.log(params)
          setSelectedRow(params.row.id)
          setMenuPosition({left: event.pageX, top: event.pageY});
        }}
      />
      <ContextMenu menuPosition={menuPosition} setMenuPosition={setMenuPosition}>
        {historyRowMenuOptions}
      </ContextMenu>
      <PackingSlipDialog
        open={viewPackingSlip}
        onClose={onPackingSlipClose}
        orderNum={"ABC1007"}
        parts={[{batchQty: 10, fulfilledQty: 0, id: "abcdef76886", orderNumber: "ABC456", part: "AB-123", partDescription:"Zach's Dummy Part"}]}
        viewOnly={true}
      />
      <DeleteAlert deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} selectedId={selectedRow}/>
    </div>
  );
};

export default HistoryTable;
