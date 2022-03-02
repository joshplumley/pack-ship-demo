import React, { useCallback, useEffect, useState, useMemo } from "react";
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
import ConfirmDialog from "../components/ConfirmDialog";
import { isShippingInfoValid } from "../utils/Validators";

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
  const [createShipmentOpen, setCreateShipmentOpen] = useState(false);
  const [currentDialogState, setCurrentDialogState] = useState(
    ShippingDialogStates.CreateShipmentTable
  );
  const [isSelectAllOn, setIsSelectAll] = useState(false);
  const [sortShippingQueueModel, setSortShippingQueueModel] = useState([
    { field: "orderNumber", sort: "asc" },
    { field: "packingSlipId", sort: "asc" },
  ]);

  // Shipping History States
  const [shippingHistory, setShippingHistory] = useState([]);
  const [filteredShippingHist, setFilteredShippingHist] = useState([]);
  const [orderNumber, setOrderNumber] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [histSearchTotalCount, setHistSearchTotalCount] = useState(0);
  const histResultsPerPage = 10;
  const [clickedHistShipment, setClickedHistShipment] = useState();
  const [historyMenuPosition, setHistoryMenuPosition] = useState(null);
  const [sortShippingHistModel, setSortShippingHistModel] = useState([
    { field: "shipmentId", sort: "asc" },
    { field: "trackingNumber", sort: "asc" },
    { field: "dateCreated", sort: "asc" },
  ]);

  // Edit Shipment Dialog
  const [isEditShipmentOpen, setIsEditShipmentOpen] = useState(false);
  const [isEditShipmentViewOnly, setIsEditShipmentViewOnly] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmShippingDeleteDialogOpen, setConfirmShippingDeleteDialogOpen] =
    useState(false);
  const [packingSlipToDelete, setPackingSlipToDelete] = useState();
  const [canErrorCheck, setCanErrorCheck] = useState(false);

  function getFormattedDate(dateString) {
    const dt = new Date(dateString);
    return `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  }

  const extractHistoryDetails = useCallback((history) => {
    return history.map((e) => {
      return {
        id: e._id,
        shipmentId: e.shipmentId,
        trackingNumber: e.trackingNumber,
        dateCreated: getFormattedDate(e.dateCreated),
      };
    });
  }, []);

  const reloadHistory = useCallback(() => {
    async function fetchData() {
      return await API.searchShippingHistory(null, null, histResultsPerPage, 0);
    }

    fetchData().then((data) => {
      let historyTableData = extractHistoryDetails(data?.data.shipments);
      setFilteredShippingHist(historyTableData);
      setShippingHistory(historyTableData);
      setHistSearchTotalCount(data?.history?.data?.totalCount);
    });
  }, [extractHistoryDetails]);

  const reloadData = useCallback(() => {
    async function fetchData() {
      return API.getShippingQueue();
    }

    fetchData().then((data) => {
      // Gather the queue data for the table
      let queueTableData = [];
      data?.packingSlips.forEach((e) => {
        queueTableData.push({
          id: e._id,
          orderNumber: e.orderNumber,
          packingSlipId: e.packingSlipId,
          customer: e.customer,
          items: e.items,
        });
      });

      // The set state order is important
      setSelectedCustomerId(null);
      setSelectedOrderIds([]);
      setShippingQueue(queueTableData);
      setFilteredShippingQueue(queueTableData);
      setIsSelectAll(false);
    });
  }, []);

  useEffect(() => {
    reloadData();
    reloadHistory();
  }, [reloadData, reloadHistory]);

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
        const selectedCustId = tableData?.find((e) => e.id === selection)
          ?.customer._id;
        const idsWithSelectedCustId = tableData
          ?.filter((e) => e.customer._id === selectedCustId)
          .map((e) => e.id);

        setIsSelectAll(
          idsWithSelectedCustId.sort().toString() ===
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

      setSelectedCustomerId(
        tableData?.find(
          (e) => newSelectedOrderIds.length > 0 && e.id === selectionModel
        )?.customer?._id ?? null
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
              .filter((e) => e.customer?._id === selectedCustomerId)
              .map((e) => e.id)
          );
        } else if (selectedOrderIds.length === 0) {
          // Nothing selected yet, so select the first row and all that match
          // the first row order number

          setSelectedOrderIds(
            tableData
              .filter((e) => e.customer?._id === tableData[0]?.customer?._id)
              .map((e) => e.id)
          );
          setSelectedCustomerId(
            tableData?.find((e) => e.id === tableData[0].id)?.customer?._id ??
              null
          );
        }
      } else {
        setSelectedOrderIds([]);
        setSelectedCustomerId(null);
      }
    },
    [selectedOrderIds, selectedCustomerId]
  );

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
    // reset whether to check form for errors
    setCanErrorCheck(false);
  }

  function onQueueSearch(value) {
    const filtered = shippingQueue.filter(
      (order) =>
        order?.orderNumber?.toLowerCase().includes(value?.toLowerCase()) ||
        order?.items?.filter((e) =>
          e.item?.partNumber?.toLowerCase().includes(value?.toLowerCase())
        ).length > 0 ||
        selectedOrderIds.includes(order?.id) // Ensure selected rows are included
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

  function onNewRowChange(oldVal, newVal) {
    const manifestIndex = clickedHistShipment?.manifest?.findIndex(
      (e) => e._id === oldVal._id
    );
    let updatedShipment = {
      ...clickedHistShipment,
    };

    updatedShipment.manifest[manifestIndex] = {
      ...oldVal,
      ...newVal,
    };
    API.searchPackingSlips(updatedShipment?.customer?._id, null).then(
      (data) => {
        updatedShipment.manifest = updatedShipment.manifest.map((e) => {
          if (e.isNew) {
            const possibleChoices = data?.packingSlips.filter(
              (t) =>
                !updatedShipment.manifest.some(
                  (m) => m._id === t._id && t._id !== e._id
                )
            );
            return {
              ...e,
              possibleSlips: possibleChoices,
            };
          }
          return e;
        });
        setClickedHistShipment(updatedShipment);
      }
    );
  }

  function onHistoryPackingSlipDelete() {
    if (packingSlipToDelete) {
      API.patchShipment(clickedHistShipment?._id, {
        deletedPackingSlips: [packingSlipToDelete.id],
      }).then((_) => {
        // remove packing slip id from shipment
        const newShipmentManifest = clickedHistShipment?.manifest?.filter(
          (e) => e._id !== packingSlipToDelete.id
        );

        setClickedHistShipment({
          ...clickedHistShipment,
          manifest: newShipmentManifest,
        });
      });
    }
  }

  function onEditShipmentSubmit() {
    setCanErrorCheck(true);

    if (isShippingInfoValid(clickedHistShipment)) {
      let sentData = { ...clickedHistShipment };

      sentData.newPackingSlips = clickedHistShipment.manifest
        .filter((e) => e?.isNew === true)
        .map((e) => e._id);

      API.patchShipment(sentData?._id, sentData)
        .then(async () => {
          setIsEditShipmentOpen(false);

          // Update the shippingHistory tracking # for main table as well
          await reloadHistory();

          //close context menu
          setHistoryMenuPosition(null);

          setCanErrorCheck(false);
        })
        .catch(() => {
          alert("Something went wrong submitting edits");
        });
    }
  }

  const onHistoryPackingSlipAdd = useCallback(
    (pageNum) => {
      API.searchPackingSlips(clickedHistShipment?.customer?._id, null).then(
        (data) => {
          let updatedShipment = { ...clickedHistShipment };
          const possibleChoices = data?.packingSlips.filter(
            (e) => !clickedHistShipment.manifest.some((m) => m._id === e._id)
          );
          if (data?.packingSlips.length > 0 && possibleChoices.length > 0) {
            updatedShipment.manifest = updatedShipment.manifest.map((e) => {
              if (e.isNew) {
                const newPossibleChoices = e.possibleSlips.filter(
                  (t) => t._id !== possibleChoices[0]._id
                );
                return {
                  ...e,
                  possibleSlips: newPossibleChoices,
                };
              }
              return e;
            });

            updatedShipment.manifest.push({
              _id: "",
              pageNum: pageNum,
              isNew: true,
              customer: clickedHistShipment.customer._id,
              possibleSlips: possibleChoices,
              ...possibleChoices[0],
            });

            setClickedHistShipment(updatedShipment);
          } else {
            alert("There are no additions that can be made.");
          }
        }
      );
    },
    [clickedHistShipment]
  );

  const historyRowMenuOptions = [
    <MenuItem
      key="view-menu-item"
      onClick={() => {
        setIsEditShipmentOpen(true);
        setIsEditShipmentViewOnly(true);
      }}
    >
      View
    </MenuItem>,
    <MenuItem key="download-menu-item">Download</MenuItem>,
    <MenuItem
      key="edit-menu-item"
      onClick={() => {
        setIsEditShipmentOpen(true);
        setIsEditShipmentViewOnly(false);
      }}
    >
      Edit
    </MenuItem>,
    <MenuItem
      key="delete-menu-item"
      onClick={() => {
        setHistoryMenuPosition(null);
        setConfirmShippingDeleteDialogOpen(true);
      }}
    >
      Delete
    </MenuItem>,
  ];

  const packingSlipIds = useMemo(() => {
    return shippingQueue
      .filter((e) => selectedOrderIds.includes(e.id))
      .map((e) => e.id);
  }, [shippingQueue, selectedOrderIds]);

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
              onChange={(e) => {
                if (
                  (e === "" || e === undefined || e === null) &&
                  (partNumber === "" ||
                    partNumber === undefined ||
                    partNumber === null)
                ) {
                  onHistoryClearClick();
                }
                setOrderNumber(e);
              }}
              placeholder="Order"
              value={orderNumber}
            />
          </Grid>
          <Grid container item xs={2}>
            <TextInput
              onChange={(e) => {
                if (
                  (e === "" || e === undefined || e === null) &&
                  (orderNumber === "" ||
                    orderNumber === undefined ||
                    orderNumber === null)
                ) {
                  onHistoryClearClick();
                }
                setPartNumber(e);
              }}
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
        queueTotal={shippingQueue?.length}
        queueTab={
          <ShippingQueueTable
            onRowClick={onQueueRowClick}
            tableData={filteredShippingQueue}
            selectedCustomerId={selectedCustomerId}
            selectionOrderIds={selectedOrderIds}
            onSelectAll={onSelectAllClick}
            isSelectAllOn={isSelectAllOn}
            setSortModel={setSortShippingQueueModel}
            sortModel={sortShippingQueueModel}
          />
        }
        historyTab={
          <ShippingHistoryTable
            tableData={filteredShippingHist}
            onPageChange={onPageChange}
            rowCount={histSearchTotalCount}
            perPageCount={histResultsPerPage}
            onRowClick={onHistoryRowClick}
            setSortModel={setSortShippingHistModel}
            sortModel={sortShippingHistModel}
          />
        }
      />

      <CreateShipmentDialog
        customer={
          shippingQueue.filter((e) => selectedOrderIds.includes(e.id))[0]
            ?.customer
        }
        packingSlipIds={packingSlipIds}
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
        reloadData={reloadData}
      />

      <EditShipmentTableDialog
        canErrorCheck={canErrorCheck}
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
          setClickedHistShipment({
            ...clickedHistShipment,
            customerHandoffName: value,
          });
        }}
        onTrackingChange={(value) => {
          setClickedHistShipment({
            ...clickedHistShipment,
            trackingNumber: value,
          });
        }}
        onNewRowChange={onNewRowChange}
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
          API.deleteShipment(clickedHistShipment._id).then(() =>
            reloadHistory()
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
