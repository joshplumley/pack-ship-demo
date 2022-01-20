import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import PackShipTabs from "../components/Tabs";
import { API } from "../services/server";
import { Box, Button, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Link } from "react-router-dom";
import { ROUTE_PACKING_SLIP } from "../router/router";
import CommonButton from "../common/Button";
import ShippingQueueTable from "./tables/ShippingQueueTable";
import CreateShipmentDialog from "../create_shipment/CreateShipmentDialog";
import ShippingDialogStates from "../create_shipment/constants/ShippingDialogConstants";
import ShippingHistoryTable from "./tables/ShippingHistoryTable";
import TextInput from "../components/TextInput";

const useStyle = makeStyles((theme) => ({
  topBarGrid: {
    paddingBottom: "20px",
  },
  navButton: {
    paddingTop: "20px",
  },
}));

export const TabNames = {
  Queue: "Queue",
  History: "History",
};

const ShippingQueue = () => {
  const classes = useStyle();

  // Common tab states
  const [currentTab, setCurrentTab] = useState(TabNames.Queue);

  // Shipping Queue States
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [shippingQueue, setShippingQueue] = useState([]);
  const [filteredShippingQueue, setFilteredShippingQueue] = useState([]);
  const [filteredSelectedIds, setFilteredSelectedIds] = useState([]);
  const [createShipmentOpen, setCreateShipmentOpen] = useState(false);
  const [currentDialogState, setCurrentDialogState] = useState(
    ShippingDialogStates.CreateShipmentTable
  );
  const [shippingInfo, setShippingInfo] = useState({
    manifest: [],
    customer: "",
    deliveryMethod: "",
  });

  // Shipping History States
  const [shippingHistory, setShippingHistory] = useState([]);
  const [filteredShippingHist, setFilteredShippingHist] = useState([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [histSearchTotalCount, setHistSearchTotalCount] = useState(0);
  const histResultsPerPage = 10;

  function getFormattedDate(dateString) {
    const dt = new Date(dateString);
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }

  useEffect(() => {
    async function fetchData() {
      const data = await Promise.all([
        API.getShippingQueue(),
        API.getShippingHistory(),
      ]);
      return { queue: data[0], history: data[1] };
    }

    fetchData().then((data) => {
      // Gather the queue data for the table
      let queueTableData = [];
      data?.queue?.packingSlips.forEach((e) => {
        console.log(e);
        queueTableData.push({
          id: e._id,
          orderNumber: e.orderNumber,
          packingSlipId: e.packingSlipId,
          items: e.items,
        });
      });

      console.log(queueTableData);
      setShippingQueue(queueTableData);
      setFilteredShippingQueue(queueTableData);

      // Gather the history data for the table
      let historyTableData = extractHistoryDetails(data?.history?.shipments);
      setFilteredShippingHist(historyTableData);
      setShippingHistory(historyTableData);
      setHistSearchTotalCount(historyTableData.length);
    });
  }, []);

  function extractHistoryDetails(history) {
    let historyTableData = [];
    history.forEach((e) => {
      historyTableData.push({
        id: e._id,
        shipmentId: e.shipmentId,
        trackingNumber: e.trackingNumber,
        dateCreated: getFormattedDate(e.dateCreated),
      });
    });
    return historyTableData;
  }

  function onQueueRowClick(selectionModel, tableData) {
    setSelectedOrderIds(selectionModel);
    setFilteredSelectedIds(selectionModel);
    for (const item of tableData) {
      // All selected items will have the same customer id
      // so we just take the first one
      if (selectionModel.length > 0 && item.id === selectionModel[0]) {
        setSelectedCustomerId(item.customerId);
        break;
      }
      // If nothing selected set it to null
      if (selectionModel.length === 0) {
        setSelectedCustomerId(null);
      }
    }
  }

  function onCreateShipmentClick() {
    setCreateShipmentOpen(true);
  }

  function onCreateShipmentClose() {
    setCreateShipmentOpen(false);
    setCurrentDialogState(ShippingDialogStates.CreateShipmentTable);
  }

  function onSearch(value) {
    const filtered = shippingQueue.filter((order) =>
      order.orderNumber.toLowerCase().includes(value.toLowerCase())
    );
  }

  function onQueueSearch(value) {
    return; // TODO
  }

  function onTabChange(event, newValue) {
    setCurrentTab(Object.keys(TabNames)[newValue]);
    setFilteredShippingHist(shippingHistory);
  }

  function onOrderInputChange(value) {
    setOrderNumber(value);
  }

  function onPartInputChange(value) {
    setPartNumber(value);
  }

  function fetchSearch(pageNumber) {
    API.searchShippingHistory(
      orderNumber,
      partNumber,
      histResultsPerPage,
      pageNumber
    ).then((data) => {
      if (data) {
        let historyTableData = extractHistoryDetails(data?.data?.shipments);
        setFilteredShippingHist(historyTableData);
        setHistSearchTotalCount(data?.data?.totalCount);
      }
    });
  }

  function onHistorySearchClick() {
    fetchSearch(0);
  }

  function onHistoryClearClick() {
    setFilteredShippingHist(shippingHistory);
    setOrderNumber("");
    setPartNumber("");
  }

  function onPageChange(pageNumber) {
    // API Pages are 1 based. MUI pages are 0 based.
    fetchSearch(pageNumber + 1);
  }

  return (
    <Box p="40px">
      {currentTab === TabNames.Queue ? (
        <Grid
          className={classes.topBarGrid}
          container
          justifyContent="start"
          spacing={2}
        >
          <Grid container item xs={"auto"}>
            <CommonButton
              label="Create Shipment"
              disabled={selectedOrderIds.length === 0}
              onClick={onCreateShipmentClick}
            />
          </Grid>
          <Grid container item justifyContent="start" xs={6}>
            <Search onSearch={onQueueSearch} />
          </Grid>
        </Grid>
      ) : (
        <Grid
          className={classes.topBarGrid}
          container
          justifyContent="start"
          spacing={2}
        >
          <Grid container item xs={"auto"}>
            <TextInput
              onChange={onOrderInputChange}
              placeholder="Order"
              value={orderNumber}
            />
          </Grid>
          <Grid container item xs={2}>
            <TextInput
              onChange={onPartInputChange}
              placeholder="Part"
              value={partNumber}
            />
          </Grid>
          <Grid container item xs={2}>
            <CommonButton
              label="Clear"
              onClick={onHistoryClearClick}
              disabled={!orderNumber && !partNumber}
            />
          </Grid>
          <Grid container item xs justifyContent="flex-end">
            <CommonButton
              label="Search"
              onClick={onHistorySearchClick}
              disabled={!orderNumber && !partNumber}
            />
          </Grid>
        </Grid>
      )}

      <PackShipTabs
        onTabChange={onTabChange}
        queueData={filteredShippingQueue}
        queueTab={
          <ShippingQueueTable
            onRowClick={onQueueRowClick}
            tableData={filteredShippingQueue}
            setTableData={setFilteredShippingQueue}
            selectedCustomerId={selectedCustomerId}
            selectionOrderIds={filteredSelectedIds}
          />
        }
        historyTab={
          <ShippingHistoryTable
            tableData={filteredShippingHist}
            onPageChange={onPageChange}
            rowCount={histSearchTotalCount}
            perPageCount={histResultsPerPage}
          />
        }
      />

      <CreateShipmentDialog
        open={createShipmentOpen}
        onClose={onCreateShipmentClose}
        currentState={currentDialogState}
        setCurrentState={setCurrentDialogState}
        shippingInfo={shippingInfo}
        setShippingInfo={setShippingInfo}
        parts={shippingQueue
          .filter((e) => selectedOrderIds.includes(e.id))
          .reduce(
            (result, current) =>
              result.concat(
                current.items.map((e) => {
                  return { ...e, id: e._id };
                })
              ),
            []
          )}
      />

      <Grid
        className={classes.navButton}
        container
        item
        xs
        justifyContent="flex-end"
      >
        <Button component={Link} to={ROUTE_PACKING_SLIP} variant="contained">
          Packing
        </Button>
      </Grid>
    </Box>
  );
};

export default ShippingQueue;
