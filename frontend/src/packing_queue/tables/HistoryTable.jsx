import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import ContextMenu from "../../components/GenericContextMenu"
import MenuItem from '@mui/material/MenuItem';
import DeleteModal from "./DeleteModal"
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

const HistoryTable = () => {
  const [menuPosition, setMenuPosition] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewPackingSlip, setViewPackingSlip] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [rows, setRows] = useState(null)

  const reloadData = useCallback(() => {
    async function fetchData() {
      return await API.getPackingSlipHistory();
    }

    fetchData().then((data) => {
      let packingSlips = [];
      data?.packingSlips?.forEach((e) => {
        packingSlips.push({
          id: e._id,
          orderId: e.orderNumber,
          packingSlipN: e.packingSlipId,
        })
      });
      setRows(packingSlips)
    });
  }, [deleteDialog]);
  
  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const openDeleteDialog = (event) => {
      setDeleteDialog(true)
      setMenuPosition(null)
      setViewPackingSlip(false)
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
    <div style={{ width: "100%" }}>
      <DataGrid
        sx={{ border: "none", height: "65vh" }}
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        onRowClick={(params, event, details) => {
          setSelectedRow(params.row)
          setMenuPosition({left: event.pageX, top: event.pageY});
        }}
      />
      <ContextMenu menuPosition={menuPosition} setMenuPosition={setMenuPosition}>
        {historyRowMenuOptions}
      </ContextMenu>
      <PackingSlipDialog
        open={viewPackingSlip}
        onClose={onPackingSlipClose}
        orderNum={selectedRow?.orderId}
        parts={[{batchQty: 10, fulfilledQty: 0, id: "abcdef76886", orderNumber: "ABC456", part: "AB-123", partDescription:"Zach's Dummy Part"}]}
        viewOnly={true}
      />
      <DeleteModal deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} selectedId={selectedRow?.id}/>
    </div>
  );
};

export default HistoryTable;
