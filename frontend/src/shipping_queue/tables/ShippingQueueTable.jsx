import React, { useState, useEffect, useMemo, useCallback } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { createColumnFilters } from "../../utils/TableFilters";
import { getCheckboxColumn } from "../../components/CheckboxColumn";
import ShipQueuePackSlipDrowdown from "./ShipQueuePackSlipDropdown";

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

const ShippingQueueTable = ({
  tableData,
  onRowClick,
  isSelectAllOn,
  onSelectAll,
  selectedCustomerId,
  selectionOrderIds,
}) => {
  const classes = useStyle();
  const [queueData, setQueueData] = useState(tableData);
  const [sortModel, setSortModel] = useState([
    { field: "orderNumber", sort: "asc" },
    { field: "packingSlipId", sort: "asc" },
  ]);

  const isDisabled = useCallback(
    (params) => {
      return (
        selectedCustomerId !== null &&
        selectedCustomerId !== params.row.customer?._id
      );
    },
    [selectedCustomerId]
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
        field: "packingSlipId",
        renderCell: (params) => {
          return <ShipQueuePackSlipDrowdown params={params} />;
        },
        flex: 2,
        renderHeader: (params) => {
          return <Typography sx={{ fontWeight: 900 }}>Packing Slip</Typography>;
        },
      },
    ],
    [
      isDisabled,
      isSelectAllOn,
      onRowClick,
      onSelectAll,
      selectionOrderIds,
      storedTableData,
    ]
  );

  useEffect(() => {
    if (sortModel.length !== 0) {
      // find the filter handler based on the column clicked
      const clickedColumnField = createColumnFilters(columns, tableData).find(
        (e) => e.field === sortModel[0]?.field
      );
      // execute the handler
      setQueueData(
        clickedColumnField?.handler(
          sortModel[0]?.sort,
          selectionOrderIds,
          tableData
        )
      );
    } else {
      return tableData;
    }
  }, [sortModel, tableData, selectionOrderIds, columns]);

  return (
    <div className={classes.root}>
      <ShippingQueueDataGrid
        sx={{ border: "none", height: "65vh" }}
        className={classes.table}
        onRowClick={(params) => {
          let tmpData = [...queueData];
          const tmpIndex = tmpData.findIndex((e) => {
            return e.id === params.id;
          });
          tmpData[tmpIndex].open = !tmpData || !tmpData[tmpIndex].open;
          setQueueData(tmpData);
        }}
        rows={queueData}
        rowHeight={65}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        columnBuffer={0}
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        checkboxSelection={false}
        disableSelectionOnClick={true}
        editMode="row"
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(model) => setSortModel(model)}
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

export default ShippingQueueTable;
