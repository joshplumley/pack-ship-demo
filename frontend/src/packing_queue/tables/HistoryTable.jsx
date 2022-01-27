import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import ContextMenu from "../../components/GenericContextMenu"
import MenuItem from '@mui/material/MenuItem';
import DeleteModal from "./DeleteModal"
import PackingSlipDialog from "../../packing_slip/PackingSlipDialog";
import { API } from "../../services/server";
import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";

const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
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

const columns = [
  {
    field: "orderId",
    renderHeader: () => {
      return <Typography sx={{ fontWeight: 900 }}>Order</Typography>;
    },
    flex: 1
  },
  {
    field: "packingSlipN",
    renderHeader: () => {
      return <Typography sx={{ fontWeight: 900 }}>Packing Slip #</Typography>;
    },
    flex: 2,
  },
  {
    field: "dateCreated", 
    renderHeader: () => {
      return <Typography sx={{ fontWeight: 900 }}>Date Created</Typography>;
    },    flex: 1 },
];

const HistoryTable = () => {
  const classes = useStyle();

  const [menuPosition, setMenuPosition] = useState();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewPackingSlip, setViewPackingSlip] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [rows, setRows] = useState([])

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
    <MenuItem key={"View"} onClick={openViewPackingSlip}>View</MenuItem>,
    <MenuItem key={"Download"}>Download</MenuItem>,
    <MenuItem key={"Edit"}>Edit</MenuItem>,
    <MenuItem key={"Delete"} onClick={openDeleteDialog}>Delete</MenuItem>
  ];

  return (
    <div className={classes.root}>
      <DataGrid
        sx={{ border: "none", height: "65vh" }}
        className={classes.table}
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
