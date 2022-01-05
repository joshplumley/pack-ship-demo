import React, { useEffect, useState } from "react";
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import HistoryTable from './tables/HistoryTable';
import QueueTable from './tables/QueueTable';
import { API } from '../services/server';

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  padding: 12px 16px;
  margin: 6px 6px;
  border: none;
  border-radius: 5px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    color: #fff;
    outline: none;
    background-color: ${blue[200]};
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${blue[50]};
    color: ${blue[600]};
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
`;

const TabsList = styled(TabsListUnstyled)`
  min-width: 320px;
  background-color: ${blue[500]};
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

export default function PackingQueueTabs({ onQueueRowClick, selectedOrderNumber }) {
  const [packingQueue, setPackingQueue] = useState([]);

  useEffect(() => {
    Promise.all([
      API.getPackingQueue().then((data) => {
        let tableData = []
        data?.forEach(e => {
          tableData.push({
            id: e._id,
            orderNumber: e.orderNumber,
            part: `${e.partNumber} - ${e.partRev}`,
            partDescription: e.partDescription,
            batchQty: e.batchQty,
            fulfilledQty: e.packedQty
          })
        });
        setPackingQueue(tableData);
      }),
    ]);
  }, []);

  return (
    <TabsUnstyled defaultValue={0}>
      <TabsList>
        <Tab>Queue ({packingQueue.length})</Tab>
        <Tab>History</Tab>
      </TabsList>
      <TabPanel value={0}>
        <QueueTable
          onRowClick={onQueueRowClick}
          tableData={packingQueue}
          selectedOrderNumber={selectedOrderNumber}
        /> </TabPanel>
      <TabPanel value={1}><HistoryTable /></TabPanel>
    </TabsUnstyled>
  );
}