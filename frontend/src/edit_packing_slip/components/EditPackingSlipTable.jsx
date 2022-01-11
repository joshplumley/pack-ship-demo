import { hasValueError } from "../../utils/validators/number_validator";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

const EditPackingSlipTable = ({ rowData, filledForm, setFilledForm }) => {
  const [dialogOpen, setDialogOpen] = useState();

  const columns = [
    {
      field: "actions",
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Actions</Typography>;
      },
      flex: 1,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          setDialogOpen(true);
        };

        return (
          <div>
            <IconButton onClick={onClick}>
              <DeleteForeverRoundedIcon />
            </IconButton>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Do You Want To Delete This?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Disagree</Button>
                <Button
                  onClick={() =>
                    setFilledForm(filledForm.filter((e) => e.id !== params.id))
                  }
                  autoFocus
                >
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      },
    },
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
      editable: true,
      preProcessEditCellProps: (params) => {
        const hasError = !hasValueError(params.props.value);
        return { ...params.props, error: hasError };
      },
    },
  ];

  return (
    <PackShipDataGrid
      rowData={rowData}
      columns={columns}
      validateError={(params) => {
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
  );
};

export default EditPackingSlipTable;
