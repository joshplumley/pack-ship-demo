import MakePackingSlipButton from "./buttons/MakePackingSlip";
import Search from "./Search";
import PackingQueueTabs from "./Tabs";
import UnfinishedBatchesCheckbox from "./UnFinishedBatchesCheckbox";

const PackingQueue = () => {
    return <>
        <MakePackingSlipButton />
        <Search />
        <UnfinishedBatchesCheckbox />
        <PackingQueueTabs />
    </>
};

export default PackingQueue;