import React, { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from "@mui/material";

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
    { field: 'batchQty', headerName: 'Batch Qty', width: 150, type: 'number' },
    { field: 'fulfilledQty', headerName: 'Fulfilled Qty', width: 150, type: 'number' },
];


const QueueTable = ({ tableData }) => {
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);

    return (
        <div style={{ height: 800, width: '100%' }}>
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
                onSelectionModelChange={(selectionModel, details) => {
                    setSelectedOrderIds(selectionModel)
                    for (const item of tableData) {
                        // All selected items will have the same order number
                        // so we just take the first one
                        if (selectionModel.length > 0 &&
                            item.id === selectionModel[0]) {
                            setSelectedOrderNumber(item.orderNumber)
                            break
                        }
                        // If nothing selected set it to null
                        if (selectionModel.length === 0) {
                            setSelectedOrderNumber(null)
                        }
                    }
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