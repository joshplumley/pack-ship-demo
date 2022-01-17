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

  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [shippingQueue, setShippingQueue] = useState([]);
  const [filteredShippingQueue, setFilteredShippingQueue] = useState([]);
  const [filteredSelectedIds, setFilteredSelectedIds] = useState([]);
  const [shippingHistory, setShippingHistory] = useState([]);
  const [filteredShippingHist, setFilteredShippingHist] = useState([]);
  const [currentTab, setCurrentTab] = useState(TabNames.Queue);
  const [orderNumber, setOrderNumber] = useState("");
  const [partNumber, setPartNumber] = useState("");

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
        queueTableData.push({
          id: e._id,
          orderNumber: e.orderNumber,
          packingSlipId: e.packingSlipId,
          items: e.items,
        });
      });
      setShippingQueue(queueTableData);
      setFilteredShippingQueue(queueTableData);

      // Gather the history data for the table
      let historyTableData = [];
      data?.history?.shipments.forEach((e) => {
        historyTableData.push({
          id: e._id,
          customer: e.customer.customerTag,
          shipmentNum: e.trackingNumber,
          dateCreated: getFormattedDate(e.dateCreated),
        });
      });
      setShippingHistory(historyTableData);
      setFilteredShippingHist(historyTableData);
    });
  }, []);

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

  function onQueueSearch(value) {
    return; // TODO
  }

  function onTabChange(event, newValue) {
    setCurrentTab(Object.keys(TabNames)[newValue]);
  }

  function onOrderInputChange(value) {
    setOrderNumber(value);
  }

  function onPartInputChange(value) {
    setPartNumber(value);
  }

  function onSearchClick() {
    API.searchShippingHistory(orderNumber, partNumber).then((data) => {
      // TODO finish this off when data is known
      let historyTableData = [];
      data?.history?.shipments.forEach((e) => {
        historyTableData.push({
          id: e._id,
          customer: e.customer.customerTag,
          shipmentNum: e.trackingNumber,
          dateCreated: getFormattedDate(e.dateCreated),
        });
      });
      setFilteredShippingHist(historyTableData);
    });
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
            />
          </Grid>
          <Grid container item xs justifyContent="start" item xs={6}>
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
            <TextInput onChange={onOrderInputChange} placeholder="Order" />
          </Grid>
          <Grid container item xs={6}>
            <TextInput onChange={onPartInputChange} placeholder="Part" />
          </Grid>
          <Grid container item xs justifyContent="flex-end">
            <CommonButton
              label="Search"
              onClick={onSearchClick}
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
        historyTab={<ShippingHistoryTable tableData={filteredShippingHist} />}
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
