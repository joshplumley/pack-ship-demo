import React, { useState, useMemo, useCallback, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
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
  sortModel,
  setSortModel,
}) => {
  const classes = useStyle();

  const [queueData, setQueueData] = useState(tableData);

  const isDisabled = useCallback(
    (params) => {
      return (
        selectedOrderNumber !== null &&
        selectedOrderNumber !== params.row.orderNumber
      );
    },
    [selectedOrderNumber]
  );

  const storedTableData = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      getCheckboxColumn(
        isDisabled,
        selectionOrderIds,
        isSelectAllOn,
        storedTableData,
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
    ],
    [
      storedTableData,
      isDisabled,
      selectionOrderIds,
      classes.fulfilledQtyHeader,
      isSelectAllOn,
      onRowClick,
      onSelectAll,
    ]
  );

  const sortDataByModel = useCallback(
    (model) => {
      if (model.length !== 0) {
        // find the filter handler based on the column clicked
        const clickedColumnField = createColumnFilters(columns, tableData).find(
          (e) => e.field === model[0]?.field
        );
        // execute the handler

        return clickedColumnField?.handler(
          model[0]?.sort,
          selectionOrderIds,
          tableData
        );
      } else {
        return tableData;
      }
    },
    [columns, selectionOrderIds, tableData]
  );

  useEffect(() => {
    setQueueData(sortDataByModel(sortModel));
  }, [sortModel, sortDataByModel]);

  return (
    <div className={classes.root}>
      <DataGrid
        sx={{ border: "none", height: "65vh" }}
        className={classes.table}
        rows={queueData}
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
        onSortModelChange={(model) => {
          setSortModel(model);
          sortDataByModel(model);
        }}
        components={{
          Footer: () =>
            selectionOrderIds.length > 0 ? (
              <Typography sx={{ padding: "8px" }}>
                {selectionOrderIds.length} rows selected
              </Typography>
            ) : (
              <div></div>
            ),
        }}
      />
    </div>
  );
};

export default PackingQueueTable;
