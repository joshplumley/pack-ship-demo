import React, { useEffect, useState } from "react";
import MakePackingSlipButton from "./buttons/MakePackingSlip";
import Search from "./Search";
import PackingQueueTabs from "./Tabs";
import UnfinishedBatchesCheckbox from "./UnFinishedBatchesCheckbox";

const PackingQueue = () => {
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState(null);


    function onQueueRowClick(selectionModel, tableData) {
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
    }

    return <>
        <MakePackingSlipButton disabled={selectedOrderIds.length === 0} />
        <Search />
        <UnfinishedBatchesCheckbox />
        <PackingQueueTabs onQueueRowClick={onQueueRowClick} selectedOrderNumber={selectedOrderNumber} />
    </>
};

export default PackingQueue;