import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/system";

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

const ShippingQueueDataGrid = styled(DataGrid)`
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

const PackingSlipDrowdown = ({ params }) => {
  return (
    <div style={{ width: "100%" }}>
      <List>
        <ListItemButton>
          {params.row.open && params.row.open !== undefined ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
          <ListItemText primary={params.row.packingSlipId.split("-")[1]} />
        </ListItemButton>
        <Collapse in={params.row.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {params.row.items.map((e) => (
              <ListItem key={e._id} divider>
                <ListItemText
                  primary={`${e.item.partNumber} (${
                    e.qty !== undefined ? e.qty : "-"
                  })`}
                  secondary={`${e.item.partDescription}`}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </div>
  );
};

const ShippingQueueTable = ({
  tableData,
  setTableData,
  onRowClick,
  selectedCustomerId,
  selectionOrderIds,
}) => {
  const classes = useStyle();

  const columns = [
    {
      field: "orderNumber",
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Order</Typography>;
      },
    },
    {
      field: "packingSlipId",
      renderCell: (params) => {
        return <PackingSlipDrowdown params={params} />;
      },
      flex: 2,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Packing Slip</Typography>;
      },
    },
  ];

  return (
    <div className={classes.root}>
      <ShippingQueueDataGrid
        sx={{ border: "none", height: "65vh" }}
        className={classes.table}
        disableSelectionOnClick={true}
        isRowSelectable={(params) => {
          // If orders are selected, disable selecting of
          // other orders if the order number does not match
          // that if the selected order
          if (
            selectedCustomerId !== null &&
            selectedCustomerId !== params.row.customer?._id
          ) {
            return false;
          }
          return true;
        }}
        onSelectionModelChange={(selectionModel, _) => {
          onRowClick(selectionModel, tableData);
        }}
        onRowClick={(params) => {
          let tmpData = [...tableData];
          const tmpIndex = tmpData.findIndex((e) => {
            return e.id === params.id;
          });
          tmpData[tmpIndex].open = !tmpData || !tmpData[tmpIndex].open;
          setTableData(tmpData);
        }}
        selectionModel={selectionOrderIds}
        rows={tableData}
        rowHeight={65}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        editMode="row"
      />
    </div>
  );
};

export default ShippingQueueTable;
