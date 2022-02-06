import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, TablePagination, Grid } from "@mui/material";
import HelpTooltip from "../../components/HelpTooltip";
import { createColumnFilters } from "../../utils/TableFilters";
import { getCheckboxColumn } from "../../components/CheckboxColumn";

const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  fulfilledQtyHeader: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  help: {
    paddingLeft: "10px",
  },
  table: {
    backgroundColor: "white",
    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
      {
        display: "none",
      },
  },
}));

const PackingQueueTable = ({
  tableData,
  onRowClick,
  isSelectAllOn,
  onSelectAll,
  selectedOrderNumber,
  selectionOrderIds,
}) => {
  const classes = useStyle();

  const [queueData, setQueueData] = useState(tableData);
  const [sortModel, setSortModel] = useState([
    { field: "orderNumber", sort: "asc" },
    { field: "part", sort: "asc" },
    { field: "batchQty", sort: "asc" },
    { field: "fulfilledQty", sort: "asc" },
  ]);

  function isDisabled(params) {
    return (
      selectedOrderNumber !== null &&
      selectedOrderNumber !== params.row.orderNumber
    );
  }

  const columns = [
    getCheckboxColumn(
      isDisabled,
      selectionOrderIds,
      isSelectAllOn,
      queueData,
      onSelectAll,
      onRowClick
    ),
    {
      field: "orderNumber",
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Order</Typography>;
      },
    },
    {
      field: "part",
      renderCell: (params) => (
        <div>
          <Typography>{params.row.part}</Typography>
          <Typography color="textSecondary">
            {params.row.partDescription}
          </Typography>
        </div>
      ),
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Part</Typography>;
      },
    },
    {
      field: "batchQty",
      type: "number",
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Batch Qty</Typography>;
      },
    },
    {
      field: "fulfilledQty",
      type: "number",
      renderHeader: (params) => {
        return (
          <div className={classes.fulfilledQtyHeader}>
            <Typography sx={{ fontWeight: 900 }}>Fulfilled Qty</Typography>
            <HelpTooltip tooltipText="This includes number of items that have been packed as well as number of items that have shipped." />
          </div>
        );
      },
      flex: 1,
    },
  ];

  const filters = createColumnFilters(columns, tableData);

  useEffect(() => {
    if (sortModel.length !== 0) {
      // find the filter handler based on the column clicked
      const clickedColumnField = filters.find(
        (e) => e.field === sortModel[0]?.field
      );
      // execute the handler
      const newRows = clickedColumnField?.handler(
        sortModel[0]?.sort,
        selectionOrderIds,
        tableData
      );
      setQueueData(newRows);
    }
  }, [sortModel, tableData]);

  const [page, setPage] = useState(0)

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  };

  return (
    <div className={classes.root}>
      <DataGrid
        sx={{ border: "none", height: "65vh" }}
        className={classes.table}
        rows={queueData.slice(page * 10, page * 10 + 10)}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        columnBuffer={0}
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        checkboxSelection={false}
        disableSelectionOnClick={true}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
        components={{
          Footer: () =>
            selectionOrderIds.length > 0 ? (
              <Grid container item alignItems="center" spacing={2}>
                <Grid container item xs={6} justifyContent="flex-start">
                  <Typography sx={{ padding: "8px" }}>
                    {selectionOrderIds.length} rows selected
                  </Typography>
                </Grid>
                <Grid container item xs={6} justifyContent="flex-end">
                  <TablePagination
                    count={queueData.length}
                    rowsPerPageOptions={[5]}
                    rowsPerPage={5}
                    onPageChange={handlePageChange}
                    page={page}
                  />
                </Grid>
              </Grid>
            ) : (
              <Grid container item xs={12} justifyContent="flex-end">
                <TablePagination
                  count={queueData.length}
                  rowsPerPageOptions={[10]}
                  rowsPerPage={10}
                  onPageChange={handlePageChange}
                  page={page}
                />
              </Grid>
            ),
        }}
      />
    </div>
  );
};

export default PackingQueueTable;
