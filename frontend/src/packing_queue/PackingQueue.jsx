import React, { useEffect, useState, useCallback } from "react";
import Search from "../components/Search";
import PackShipTabs from "../components/Tabs";
import CheckboxForm from "../components/CheckboxForm";
import { API } from "../services/server";
import { Box, Button, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Link } from "react-router-dom";
import { ROUTE_SHIPMENTS } from "../router/router";
import CommonButton from "../common/Button";
import PackingSlipDialog from "../packing_slip/PackingSlipDialog";
import PackingQueueTable from "./tables/PackingQueueTable";
import HistoryTable from "./tables/HistoryTable";

const useStyle = makeStyles((theme) => ({
  topBarGrid: {
    paddingBottom: "20px",
  },
  navButton: {
    paddingTop: "20px",
  },
}));

const PackingQueue = () => {
  const classes = useStyle();

  const [searchString, setSearchString] = useState("");

  const [isShowUnfinishedBatches, setIsShowUnfinishedBatches] = useState(true);
  const [isFulfilledBatchesOn, setIsFulfilledBatchesOn] = useState(true);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);
  const [packingQueue, setPackingQueue] = useState([]);
  const [filteredPackingQueue, setFilteredPackingQueue] = useState([]);
  const [packingSlipOpen, setPackingSlipOpen] = useState(false);
  const [isSelectAllOn, setIsSelectAll] = useState(false);
  const [sortPackQueueModel, setSortPackQueueModel] = useState([
    { field: "orderNumber", sort: "asc" },
    { field: "part", sort: "asc" },
    { field: "batchQty", sort: "asc" },
    { field: "fulfilledQty", sort: "asc" },
  ]);
  const [sortPackHistoryModel, setSortPackHistoryModel] = useState([
    { field: "orderId", sort: "asc" },
    { field: "packingSlipId", sort: "asc" },
    { field: "dateCreated", sort: "asc" },
  ]);

  useEffect(() => {
    async function fetchData() {
      if (isShowUnfinishedBatches) {
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
  }, [isShowUnfinishedBatches]);

  function onPackingSlipClick() {
    setPackingSlipOpen(true);
  }

  function onPackingSlipClose() {
    setPackingSlipOpen(false);
  }

  function onPackingSlipSubmit(filledForm, orderNum) {
    const items = filledForm.map((e) => {
      return { item: e.id, qty: e.packQty };
    });
    API.createPackingSlip(items, filledForm[0].customer, orderNum)
      .then(() => {
        // update the fullfilled Qty
        const updatedFulfilled = filledForm.map((e) => {
          let tmp = {
            ...e,
            fulfilledQty: e.fulfilledQty + parseInt(e.packQty),
          };
          delete tmp.packQty;
          return tmp;
        });

        // remove the old one
        const updatedPackingQueue = filteredPackingQueue.filter(
          (e) => !updatedFulfilled.map((f) => f.id).includes(e.id)
        );

        // add the new ones and set
        setFilteredPackingQueue(updatedPackingQueue.concat(updatedFulfilled));

        onPackingSlipClose();
      })
      .catch(() => {
        alert("An error occurred submitting packing slip");
      });
  }

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
    [handleSelection]
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
    [selectedOrderIds, selectedOrderNumber]
  );

  function onSearch(value) {
    setSearchString(value);
    const filteredQueue = packingQueue.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(value.toLowerCase()) ||
        order.part.toLowerCase().includes(value.toLowerCase()) ||
        selectedOrderIds.includes(order.id) // Ensure selected rows are included
    );

    setFilteredPackingQueue(filteredQueue);
  }

  return (
    <Box p="40px">
      <Grid
        className={classes.topBarGrid}
        container
        justifyContent="start"
        spacing={2}
      >
        <Grid container item xs={"auto"}>
          <CommonButton
            label="Make Packing Slip"
            disabled={selectedOrderIds.length === 0}
            onClick={onPackingSlipClick}
          />
        </Grid>
        <Grid container justifyContent="start" item xs={6}>
          <Search onSearch={onSearch} />
        </Grid>
        <Grid container item xs justifyContent="flex-end">
          <CheckboxForm
            label="Show Unfinished Batches"
            disabled={true}
            onChange={() => console.log("not implemented yet")}
            checked={isShowUnfinishedBatches}
          />
        </Grid>
        <Grid container item xs justifyContent="flex-end">
          <CheckboxForm
            label="Show Fulfilled Batches"
            onChange={(checked) => {
              setIsFulfilledBatchesOn(checked);

              if (isFulfilledBatchesOn) {
                setFilteredPackingQueue(
                  filteredPackingQueue.filter(
                    (e) => e.fulfilledQty < e.batchQty
                  )
                );
              } else {
                setFilteredPackingQueue(packingQueue);
              }
            }}
            checked={isFulfilledBatchesOn}
          />
        </Grid>
      </Grid>

      <PackShipTabs
        queueTotal={packingQueue?.length}
        queueTab={
          <PackingQueueTable
            onRowClick={onQueueRowClick}
            isSelectAllOn={isSelectAllOn}
            onSelectAll={onSelectAllClick}
            tableData={filteredPackingQueue}
            selectedOrderNumber={selectedOrderNumber}
            selectionOrderIds={selectedOrderIds}
            sortModel={sortPackQueueModel}
            setSortModel={setSortPackQueueModel}
          />
        }
        historyTab={
          <HistoryTable
            sortModel={sortPackHistoryModel}
            setSortModel={setSortPackHistoryModel}
            searchString={searchString}
          />
        }
      />

      <PackingSlipDialog
        onSubmit={onPackingSlipSubmit}
        open={packingSlipOpen}
        onClose={onPackingSlipClose}
        orderNum={selectedOrderNumber}
        title={`Create Packing Slip for ${selectedOrderNumber}`}
        parts={filteredPackingQueue
          .filter((e) => selectedOrderIds.includes(e.id))
          .map((e) => {
            return {
              ...e,
              packQty:
                e.fulfilledQty > e.batchQty ? 0 : e.batchQty - e.fulfilledQty,
            };
          })}
      />

      <Grid
        className={classes.navButton}
        container
        item
        xs
        justifyContent="flex-end"
      >
        <Button component={Link} to={ROUTE_SHIPMENTS} variant="contained">
          Shipments
        </Button>
      </Grid>
    </Box>
  );
};

export default PackingQueue;
