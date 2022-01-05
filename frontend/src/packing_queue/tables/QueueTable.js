import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { API } from '../../services/server';

const columns = [
    { field: 'orderNumber', headerName: 'Order', width: 200 },
    { field: 'part', headerName: 'Part', width: 250 },
    { field: 'batchQty', headerName: 'Batch Qty', width: 150, type: 'number' },
    { field: 'fulfilledQty', headerName: 'Fulfilled Qty', width: 150, type: 'number' },
];



const QueueTable = () => {
    const [packingQueue, setPackingQueue] = useState([]);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);

    useEffect(() => {
        Promise.all([
            API.getPackingQueue().then((data) => {
                let tableData = []
                data?.forEach(e => {
                    tableData.push({
                        id: e._id,
                        orderNumber: e.orderNumber,
                        part: `${e.partNumber} - ${e.partRev} : ${e.partDescription}`,
                        batchQty: e.batchQty,
                        fulfilledQty: e.packedQty
                    })
                });
                setPackingQueue(tableData);
            }),
        ]);
    }, []);

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
                        console.log(params.row.orderNumber)
                        return false
                    }
                    return true
                }}
                onSelectionModelChange={(selectionModel, details) => {
                    setSelectedOrderIds(selectionModel)
                    for (const item of packingQueue) {
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
                rows={packingQueue}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
            />
        </div>
    );
}

export default QueueTable;