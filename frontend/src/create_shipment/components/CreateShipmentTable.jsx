import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const CreateShipmentTable = ({ rowData }) => {
  console.log(rowData);
  const columns = [
    {
      field: "part",
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Part</Typography>;
      },
      renderCell: (params) => {
        return (
          <div>
            <Typography sx={{ padding: "4px" }} color="textSecondary">
              {`${params.row.partNumber} - Rev ${params.row.partRev}`}
            </Typography>
            <Typography sx={{ padding: "4px" }} color="textSecondary">
              {params.row.partDescription}
            </Typography>
          </div>
        );
      },
      flex: 2,
    },
    {
      field: "quantity",
      type: "number",
      flex: 1,
      renderHeader: (params) => {
        return <Typography sx={{ fontWeight: 900 }}>Ship Qty</Typography>;
      },
      renderCell: (params) => {
        return (
          <Typography color="textSecondary">{params.row.quantity}</Typography>
        );
      },
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={rowData}
      columns={columns}
      disableSelectionOnClick
      rowHeight={65}
    />
  );
};

export default CreateShipmentTable;
