import { Typography, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import HelpTooltip from "../../components/HelpTooltip";
import { makeStyles } from "@mui/styles";

const useStyle = makeStyles((theme) => ({
  fulfilledQtyHeader: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

const PackingSlipTable = ({ rowData, filledForm, setFilledForm, viewOnly=false }) => {
  const classes = useStyle();

  console.log("ZH")
  console.log(rowData)

  function hasValueError(value) {
    return /^[-+]?(\d+)$/.test(value);
  }

  const columns = [
    {
      field: "part",
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Part</Typography>;
      },
      flex: 1,
    },
    {
      field: "batchQty",
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Batch Qty</Typography>;
      },
      type: "number",
      flex: 1,
    },
    {
      field: "fulfilledQty",
      headerName: "Fulfilled Qty",
      type: "number",
      flex: 1,
      renderHeader: (params) => {
        return (
          <div className={classes.fulfilledQtyHeader}>
            <Typography sx={{ fontWeight: 900 }}>Fulfilled Qty</Typography>
            <HelpTooltip
              tooltipText={
                "This includes number of items that have been packed as well as number of items that have shipped."
              }
            />
          </div>
        );
      },
    },
    {
      field: "packQty",
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Pack Qty</Typography>;
      },
      flex: 1,
      default: 0,
      editable: !viewOnly,
      preProcessEditCellProps: (params) => {
        const hasError = !hasValueError(params.props.value);
        return { ...params.props, error: hasError };
      },
    },
  ];

  return (
    <Box
      sx={{
        height: 400,
        width: 1,
        "& .MuiDataGrid-cell--editing": {
          bgcolor: "rgb(255,215,115, 0.19)",
          color: "#1a3e72",
        },
        "& .Mui-error": {
          bgcolor: (theme) =>
            `rgb(126,10,15, ${theme.palette.mode === "dark" ? 0 : 0.1})`,
          color: (theme) =>
            theme.palette.mode === "dark" ? "#ff4343" : "#750f0f",
        },
      }}
    >
      <DataGrid
        autoHeight
        rows={rowData}
        columns={columns}
        disableSelectionOnClick
        onCellEditCommit={(params) => {
          setFilledForm(
            filledForm.map((e) => {
              if (e.id === params.id && params.field === "packQty") {
                return { ...e, packQty: params.value };
              }
              return e;
            })
          );
        }}
      />
    </Box>
  );
};

export default PackingSlipTable;
