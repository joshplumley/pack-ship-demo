import React from "react";
import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import { buttonUnstyledClasses } from "@mui/base/ButtonUnstyled";
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
import HistoryTable from "./tables/HistoryTable";
import QueueTable from "./tables/QueueTable";
import { Box } from "@mui/material";
// import { API } from '../services/server';

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#80BFFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  800: "#004C99",
  900: "#003A75",
};

const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: grey;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  width: 100%;
  padding: 12px 16px;
  border: none;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #9e9e9e};
  }

  &.${buttonUnstyledClasses.focusVisible} {
    color: #fff;
    outline: none;
    background-color: ${blue[200]};
  }

  &.${tabUnstyledClasses.selected} {
    background-color: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    color: black;
  }

  &.${buttonUnstyledClasses.disabled} {
    // opacity: 0.5;
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
  border-radius: 8px;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

export default function PackingQueueTabs({
  queueData,
  onQueueRowClick,
  selectedOrderNumber,
}) {
  return (
    <Box borderRadius="16px" p={2} backgroundColor="grey.200">
      <TabsUnstyled defaultValue={0}>
        <TabsList>
          <Tab>Queue ({queueData.length})</Tab>
          <Tab>History</Tab>
        </TabsList>
        <TabPanel value={0}>
          <QueueTable
            onRowClick={onQueueRowClick}
            tableData={queueData}
            selectedOrderNumber={selectedOrderNumber}
          />
        </TabPanel>
        <TabPanel value={1}>
          <HistoryTable />
        </TabPanel>
      </TabsUnstyled>
    </Box>
  );
}
