import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { API } from '../../services/server';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'orderId', headerName: 'Order', width: 200 },
    { field: 'part', headerName: 'Part', width: 250 },
    { field: 'batchQty', headerName: 'Batch Qty', width: 150, type: 'number' },
    { field: 'fulfilledQty', headerName: 'Fulfilled Qty', width: 150, type: 'number' },
];



const QueueTable = () => {
    const [packingQueue, setpackingQueue] = useState([]);

    useEffect(() => {
        Promise.all([
            API.getPackingQueue().then((data) => {
                setpackingQueue(data);
            }),
        ]);
    });

    const rows = [
        {
            id: 1,
            orderId: 'ABC1001',
            part: 'PN-001-Rev 01',
            batchQty: 7,
            fulfilledQty: 1
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    );
}

export default QueueTable;