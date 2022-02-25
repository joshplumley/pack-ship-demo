import React, { useState, useMemo, useCallback, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
import { Typography, TablePagination, Grid } from "@mui/material";
import HelpTooltip from "../../components/HelpTooltip";
import { createColumnFilters } from "../../utils/TableFilters";
import { getCheckboxColumn } from "../../components/CheckboxColumn";
import { API } from "../../services/server";

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
  packingQueue,
  selectedOrderNumber,
  selectionOrderIds,
  sortModel,
  setSortModel,
  setPackingQueue,
  setFilteredPackingQueue,
  isShowUnfinishedBatches,
  setSelectedOrderIds,
  selectedOrderIds,
  setSelectedOrderNumber,
  searchString,
}) => {
  const classes = useStyle();
  const numRowsPerPage = 10;

  const [queueData, setQueueData] = useState(tableData);
  const [isSelectAllOn, setIsSelectAll] = useState(false);

  const isDisabled = useCallback(
    (params) => {
      return (
        selectedOrderNumber !== null &&
        selectedOrderNumber !== params.row.orderNumber
      );
    },
    [selectedOrderNumber]
  );

  const handleSelection = useCallback(
    (selection, tableData) => {
      let newSelection = selectedOrderIds;
      if (selectedOrderIds.includes(selection)) {
        // remove it
        newSelection = selectedOrderIds.filter((e) => e !== selection);
        // if something is deselected then selectAll is false
        setIsSelectAll(false);
      } else {
        // add it
        newSelection.push(selection);

        // if the new selection contains all possible selected order numbers
        // then select all is on
        const selectedOrderNum = tableData?.find(
          (e) => e.id === selection
        )?.orderNumber;
        const idsWithSelectedOrderNum = tableData
          ?.filter((e) => e.orderNumber === selectedOrderNum)
          .map((e) => e.id);

        setIsSelectAll(
          idsWithSelectedOrderNum.sort().toString() ===
            newSelection.sort().toString()
        );
      }
      return newSelection;
    },
    [selectedOrderIds]
  );

  const onQueueRowClick = useCallback(
    (selectionModel, tableData) => {
      const newSelectedOrderIds = handleSelection(selectionModel, tableData);
      setSelectedOrderIds([...newSelectedOrderIds]);

      setSelectedOrderNumber(
        tableData?.find(
          (e) => newSelectedOrderIds.length > 0 && e.id === selectionModel
        )?.orderNumber ?? null
      );
    },
    [handleSelection, setSelectedOrderNumber, setSelectedOrderIds]
  );

  const onSelectAllClick = useCallback(
    (value, tableData) => {
      setIsSelectAll(value);

      if (value) {
        if (selectedOrderIds.length > 0) {
          // Something is selected, so we need to select the remaining
          // that matach selectedOrderNumber
          setSelectedOrderIds(
            tableData
              .filter((e) => e.orderNumber === selectedOrderNumber)
              .map((e) => e.id)
          );
        } else if (selectedOrderIds.length === 0) {
          // Nothing selected yet, so select the first row and all that match
          // the first row order number

          setSelectedOrderIds(
            tableData
              .filter((e) => e.orderNumber === tableData[0]?.orderNumber)
              .map((e) => e.id)
          );
          setSelectedOrderNumber(
            tableData?.find((e) => e.id === tableData[0].id)?.orderNumber ??
              null
          );
        }
      } else {
        setSelectedOrderIds([]);
        setSelectedOrderNumber(null);
      }
    },
    [
      selectedOrderIds,
      selectedOrderNumber,
      setSelectedOrderIds,
      setSelectedOrderNumber,
    ]
  );

  useEffect(() => {
    async function fetchData() {
      if (true /*isShowUnfinishedBatches*/) {
        return await API.getAllWorkOrders();
      } else {
        return await API.getPackingQueue();
      }
    }

    fetchData().then((data) => {
      let tableData = [];
      data?.forEach((e) => {
        tableData.push({
          id: e._id,
          orderNumber: e.orderNumber,
          part: `${e.partNumber} - ${e.partRev}`,
          partDescription: e.partDescription,
          batchQty: e.batchQty,
          fulfilledQty: e.packedQty,
          customer: e.customer,
        });
      });
      setPackingQueue(tableData);
      setFilteredPackingQueue(tableData);
    });
  }, [isShowUnfinishedBatches, setFilteredPackingQueue, setPackingQueue]);

  useEffect(() => {
    if (searchString) {
      const filteredQueue = packingQueue.filter(
        (order) =>
          order.orderNumber
            .toLowerCase()
            .includes(searchString.toLowerCase()) ||
          order.part.toLowerCase().includes(searchString.toLowerCase()) ||
          selectedOrderIds.includes(order.id) // Ensure selected rows are included
      );

      setFilteredPackingQueue(filteredQueue);
    }
  }, [packingQueue, searchString, selectedOrderIds, setFilteredPackingQueue]);

  const storedTableData = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      getCheckboxColumn(
        isDisabled,
        selectionOrderIds,
        isSelectAllOn,
        storedTableData,
        onSelectAllClick,
        onQueueRowClick
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
      onQueueRowClick,
      onSelectAllClick,
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

  const [page, setPage] = useState(0);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const generateTablePagination = useCallback(() => {
    return (
      <table>
        <tbody>
          <tr>
            <TablePagination
              count={queueData.length}
              rowsPerPageOptions={[numRowsPerPage]}
              rowsPerPage={numRowsPerPage}
              onPageChange={handlePageChange}
              page={page}
              sx={{ border: "0px" }}
            />
          </tr>
        </tbody>
      </table>
    );
  }, [page, queueData.length]);

  return (
    <div className={classes.root}>
      <DataGrid
        sx={{ border: "none", height: "65vh" }}
        className={classes.table}
        rows={queueData.slice(
          page * numRowsPerPage,
          page * numRowsPerPage + numRowsPerPage
        )}
        columns={columns}
        pageSize={numRowsPerPage}
        rowsPerPageOptions={[numRowsPerPage]}
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
              <Grid container item alignItems="center" spacing={2}>
                <Grid container item xs={6} justifyContent="flex-start">
                  <Typography sx={{ padding: "8px" }}>
                    {selectionOrderIds.length} rows selected
                  </Typography>
                </Grid>
                <Grid container item xs={6} justifyContent="flex-end">
                  {generateTablePagination()}
                </Grid>
              </Grid>
            ) : (
              <Grid container item xs={12} justifyContent="flex-end">
                {generateTablePagination()}
              </Grid>
            ),
        }}
      />
    </div>
  );
};

export default PackingQueueTable;
