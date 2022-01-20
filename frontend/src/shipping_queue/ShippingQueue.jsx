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

const useStyle = makeStyles((theme) => ({
  topBarGrid: {
    paddingBottom: "20px",
  },
  navButton: {
    paddingTop: "20px",
  },
}));

const ShippingQueue = () => {
  const classes = useStyle();

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

  useEffect(() => {
    async function fetchData() {
      return await API.getShippingQueue();
    }

    fetchData().then((data) => {
      let tableData = [];
      data?.packingSlips.forEach((e) => {
        tableData.push({
          id: e._id,
          orderNumber: e.orderNumber,
          packingSlipId: e.packingSlipId,
          items: e.items,
        });
      });
      console.log(tableData);
      setShippingQueue(tableData);
      setFilteredShippingQueue(tableData);
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

    let filteredSelectedIds = [];
    filtered.forEach((e) => {
      if (selectedOrderIds.includes(e.id)) {
        filteredSelectedIds.push(e.id);
      }
    });
    setFilteredSelectedIds(filteredSelectedIds);
    setFilteredShippingQueue(filtered);
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
            label="Create Shipment"
            disabled={selectedOrderIds.length === 0}
            onClick={onCreateShipmentClick}
          />
        </Grid>
        <Grid container justifyContent="start" item xs={6}>
          <Search onSearch={onSearch} />
        </Grid>
      </Grid>

      <PackShipTabs
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
