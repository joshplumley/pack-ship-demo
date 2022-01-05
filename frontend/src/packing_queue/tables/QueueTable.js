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
    const [packingQueue, setpackingQueue] = useState([]);

    useEffect(() => {
        Promise.all([
            API.getPackingQueue().then((data) => {
                let tableData = []
                data.forEach(e => {
                    console.log(e.orderId)
                    tableData.push({
                        id: e._id,
                        orderNumber: e.orderNumber,
                        part: `${e.partNumber} - ${e.partRev} : ${e.partDescription}`,
                        batchQty: e.batchQty,
                        fulfilledQty: e.packedQty
                    })
                });
                setpackingQueue(tableData);
            }),
        ]);
    }, []);

    return (
        <div style={{ height: 800, width: '100%' }}>
            <DataGrid
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