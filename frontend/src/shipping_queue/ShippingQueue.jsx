import React, { useCallback, useEffect, useState } from "react";
import Search from "../components/Search";
import PackShipTabs from "../components/Tabs";
import { API } from "../services/server";
import { Box, Button, Grid, MenuItem, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Link } from "react-router-dom";
import { ROUTE_PACKING_SLIP } from "../router/router";
import CommonButton from "../common/Button";
import ShippingQueueTable from "./tables/ShippingQueueTable";
import CreateShipmentDialog from "../create_shipment/CreateShipmentDialog";
import ShippingDialogStates from "../create_shipment/constants/ShippingDialogConstants";
import ShippingHistoryTable from "./tables/ShippingHistoryTable";
import TextInput from "../components/TextInput";
import EditShipmentTableDialog from "./EditShipmentDialog";
import ContextMenu from "../components/GenericContextMenu";
import ConfirmDialog from "../components/ConfrimDialog";

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

  // Shipping History States
  const [shippingHistory, setShippingHistory] = useState([]);
  const [filteredShippingHist, setFilteredShippingHist] = useState([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [histSearchTotalCount, setHistSearchTotalCount] = useState(0);
  const histResultsPerPage = 10;
  const [clickedHistShipment, setClickedHistShipment] = useState();
  const [historyMenuPosition, setHistoryMenuPosition] = useState(null);

  // Edit Shipment Dialog
  const [isEditShipmentOpen, setIsEditShipmentOpen] = useState(false);
  const [isEditShipmentViewOnly, setIsEditShipmentViewOnly] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmShippingDeleteDialogOpen, setConfirmShippingDeleteDialogOpen] =
    useState(false);
  const [packingSlipToDelete, setPackingSlipToDelete] = useState();

  function getFormattedDate(dateString) {
    const dt = new Date(dateString);
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }

  const extractHistoryDetails = useCallback((history) => {
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
  }, []);

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
          customer: e.customer,
          items: e.items,
        });
      });

      setShippingQueue(queueTableData);
      setFilteredShippingQueue(queueTableData);

      // Gather the history data for the table
      let historyTableData = extractHistoryDetails(data?.history?.shipments);
      setFilteredShippingHist(historyTableData);
      setShippingHistory(historyTableData);
      setHistSearchTotalCount(historyTableData.length);
    });
  }, [extractHistoryDetails]);

  function onQueueRowClick(selectionModel, tableData) {
    setSelectedOrderIds(selectionModel);
    setFilteredSelectedIds(selectionModel);
    const customerId =
      selectionModel.length > 0
        ? tableData.find((element) => element.id === selectionModel[0]).customer
            ?._id
        : undefined;
    for (const item of tableData) {
      // All selected items will have the same customer id
      // so we just take the first one
      if (selectionModel.length > 0 && item.customer?._id === customerId) {
        setSelectedCustomerId(item.customer._id);
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

  function onEditShipmentClose() {
    // close context menu
    setHistoryMenuPosition(null);
    // close edit dialog
    setIsEditShipmentOpen(false);
  }

  function onQueueSearch(value) {
    const filtered = shippingQueue.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(value.toLowerCase()) ||
        order.items.filter((e) =>
          e.item.partNumber.toLowerCase().includes(value.toLowerCase())
        ).length > 0 ||
        selectedOrderIds.includes(order.id) // Ensure selected rows are included
    );

    setFilteredShippingQueue(filtered);
  }

  function onTabChange(event, newValue) {
    setCurrentTab(Object.keys(TabNames)[newValue]);
    setFilteredShippingHist(shippingHistory);
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

  function onHistoryRowClick(params, event, __) {
    API.getShipment(params.id).then((data) => {
      if (data) {
        setClickedHistShipment(data.shipment);
      }
    });

    setHistoryMenuPosition({ left: event.pageX, top: event.pageY });
  }

  function onHistoryPackingSlipDelete() {
    // remove packing slip id from shipment
    if (packingSlipToDelete) {
      const newShipmentManifest = clickedHistShipment?.manifest?.filter(
        (e) => e._id !== packingSlipToDelete.id
      );
      const updatedShipment = {
        manifest: newShipmentManifest,
      };
      API.patchShipment(clickedHistShipment?._id, updatedShipment).then((_) =>
        setClickedHistShipment({
          ...clickedHistShipment,
          ...updatedShipment,
        })
      );
    }
  }

  //  TODO need a confirm on this as well
  function onEditShipmentSubmit() {
    API.patchShipment(clickedHistShipment?._id, clickedHistShipment);
    setIsEditShipmentOpen(false);

    // Update the shippingHistory tracking # for main table as well
    setFilteredShippingHist(
      shippingHistory.map((obj) => {
        if (obj.id === clickedHistShipment?._id) {
          return {
            ...obj,
            trackingNumber: clickedHistShipment?.trackingNumber,
          };
        } else {
          return obj;
        }
      })
    );

    //close context menu
    setHistoryMenuPosition(null);
  }

  const onHistoryPackingSlipAdd = useCallback(
    (params) => {
      let updatedShipment = clickedHistShipment;
      let TEST = Object.assign({}, clickedHistShipment?.manifest[0]);
      TEST._id = "TEST";
      updatedShipment?.manifest.push(TEST); // TODOD
      setClickedHistShipment({ ...updatedShipment });
    },
    [clickedHistShipment]
  );

  const historyRowMenuOptions = [
    <MenuItem
      onClick={() => {
        setIsEditShipmentOpen(true);
        setIsEditShipmentViewOnly(true);
      }}
    >
      View
    </MenuItem>,
    <MenuItem>Download</MenuItem>,
    <MenuItem
      onClick={() => {
        setIsEditShipmentOpen(true);
        setIsEditShipmentViewOnly(false);
      }}
    >
      Edit
    </MenuItem>,
    <MenuItem
      onClick={() => {
        setHistoryMenuPosition(null);
        setConfirmShippingDeleteDialogOpen(true);
      }}
    >
      Delete
    </MenuItem>,
  ];

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
              onChange={setOrderNumber}
              placeholder="Order"
              value={orderNumber}
            />
          </Grid>
          <Grid container item xs={2}>
            <TextInput
              onChange={setPartNumber}
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
            onRowClick={onHistoryRowClick}
          />
        }
      />

      <CreateShipmentDialog
        customer={
          shippingQueue.filter((e) => selectedOrderIds.includes(e.id))[0]
            ?.customer
        }
        packingSlipIds={shippingQueue
          .filter((e) => selectedOrderIds.includes(e.id))
          .map((e) => e.id)}
        open={createShipmentOpen}
        onClose={onCreateShipmentClose}
        currentState={currentDialogState}
        setCurrentState={setCurrentDialogState}
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

      <EditShipmentTableDialog
        shipment={clickedHistShipment}
        isOpen={isEditShipmentOpen}
        onClose={onEditShipmentClose}
        onSubmit={onEditShipmentSubmit}
        viewOnly={isEditShipmentViewOnly}
        onDelete={(params) => {
          setConfirmDeleteDialogOpen(true);
          setPackingSlipToDelete(params.row);
        }}
        onAdd={onHistoryPackingSlipAdd}
        onCostChange={(value) => {
          setClickedHistShipment({ ...clickedHistShipment, cost: value });
        }}
        onCarrierInputChange={(value) => {
          setClickedHistShipment({
            ...clickedHistShipment,
            carrier: value,
          });
        }}
        onDeliverySpeedChange={(value) => {
          setClickedHistShipment({
            ...clickedHistShipment,
            deliverySpeed: value,
          });
        }}
        onCustomerAccountChange={(value) => {
          setClickedHistShipment({
            ...clickedHistShipment,
            customerAccount: value,
          });
        }}
        onCustomerNameChange={(value) => {
          //TODO is this right? customerTag for customerName
          // setClickedHistShipment({
          //   ...clickedHistShipment,
          //   customerName: value,
          // });
        }}
        onTrackingChange={(value) => {
          setClickedHistShipment({
            ...clickedHistShipment,
            trackingNumber: value,
          });
        }}
      />

      <ConfirmDialog
        title="Are You Sure You Want To Delete This?"
        open={confirmDeleteDialogOpen}
        setOpen={setConfirmDeleteDialogOpen}
        onConfirm={onHistoryPackingSlipDelete}
      />

      <ConfirmDialog
        title={`Are You Sure You Want To Delete`}
        open={confirmShippingDeleteDialogOpen}
        setOpen={setConfirmShippingDeleteDialogOpen}
        onConfirm={() => {
          API.deleteShipment(clickedHistShipment._id);
          setFilteredShippingHist(
            filteredShippingHist.filter((e) => e.id !== clickedHistShipment._id)
          );
        }}
      >
        <Typography sx={{ fontWeight: 900 }}>
          {clickedHistShipment?.shipmentId}
        </Typography>
      </ConfirmDialog>

      <ContextMenu
        menuPosition={historyMenuPosition}
        setMenuPosition={setHistoryMenuPosition}
      >
        {historyRowMenuOptions}
      </ContextMenu>

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
