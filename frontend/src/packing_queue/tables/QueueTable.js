import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { DataGrid } from '@mui/x-data-grid';
import { Tooltip, Typography } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const useStyle = makeStyles((theme) => ({
    root: {
        height: 800,
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
    },
    fulfilledQtyHeader: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    help: {
        paddingLeft: '10px',
    }
}));


const QueueTable = ({ tableData, onRowClick, selectedOrderNumber }) => {
    const classes = useStyle();

    const columns = [
        { field: 'orderNumber', headerName: 'Order', width: 200 },
        {
            field: 'part', headerName: 'Part', width: 250, renderCell: (params) => (
                <div>
                    <Typography>{params.row.part}</Typography>
                    <Typography color="textSecondary">{params.row.partDescription}</Typography>
                </div>
            )
        },
        { field: 'batchQty', headerName: 'Batch Qty', width: 250, type: 'number' },
        {
            field: 'fulfilledQty', headerName: 'Fulfilled Qty', width: 250, type: 'number',
            renderHeader: (params) => {
                return (
                    <div className={classes.fulfilledQtyHeader}>
                        <Typography>Fulfilled Qty</Typography>
                        <Tooltip title="This includes number of items that have been packed as well as number of items that have shipped.">
                            <HelpOutlineIcon className={classes.help} />
                        </Tooltip>
                    </div>
                );
            }
        },
    ];

    return (
        <div className={classes.root}>
            <DataGrid
                disableSelectionOnClick={false}
                isRowSelectable={(params) => {
                    // If orders are selected, disable selecting of 
                    // other orders if the order number does not match
                    // that if the selected order
                    if (selectedOrderNumber !== null &&
                        selectedOrderNumber !== params.row.orderNumber) {
                        return false
                    }
                    return true
                }}
                onSelectionModelChange={(selectionModel, _) => {
                    onRowClick(selectionModel, tableData)
                }}
                rows={tableData}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
            />
        </div>
    );
}

export default QueueTable;