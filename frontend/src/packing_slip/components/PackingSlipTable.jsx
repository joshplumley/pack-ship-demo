import { Typography, Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import HelpTooltip from "../../components/HelpTooltip";
import { makeStyles } from "@mui/styles";
import { hasValueError } from "../../utils/validators/number_validator";

const useStyle = makeStyles((theme) => ({
  fulfilledQtyHeader: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

const PackingSlipTable = ({
  rowData,
  filledForm,
  setFilledForm,
  viewOnly = false,
}) => {
  const classes = useStyle();

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
      // renderCell: (params) => {
      //   console.log("RENDER", params);
      //   return (
      //     <TextField
      //       // autoFocus={params.id === "61fecad561868753c2a3de80"}
      //       fullWidth
      //       error={params.error}
      //       value={params.row.packQty}
      //       onChange={(event) => {
      //         console.log("CHANGING VALUE", event);
      //         // setFilledForm(
      //         //   filledForm.map((e) => {
      //         //     if (e.id === params.id && params.field === "packQty") {
      //         //       return { ...e, packQty: params.value };
      //         //     }
      //         //     return e;
      //         //   })
      //         // );
      //       }}
      //     />
      //   );
      // },
    },
  ];

  return (
    <Box
      sx={{
        height: "55vh",
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
        sx={{
          border: "none",
          height: "50vh",
          "& .MuiDataGrid-cell--editable": {
            // padding: "0px",
            backgroundColor: "grey",
            border: "solid 1px grey",
            boxShadow: "1px 1px grey",
            ":hover": {
              border: "solid 1px black",
            },
          },
        }}
        rows={rowData}
        columns={columns}
        disableSelectionOnClick
        pageSize={rowData.length}
        rowsPerPageOptions={[rowData.length]}
        hideFooter
        editCellPropsChange={(params) => console.log("MEEP", params)}
        onCellClick={(params) => console.log("CLICK", params)}
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
