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
import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  tab: {
    backgroundColor: theme.palette.secondary.light,
  },
}));

const Tab = styled(TabUnstyled)(({ theme }) => {
  return `
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
  // background-color: ${theme.palette.primary.light}};

  &:hover {
    background-color: ${theme.palette.primary.light}};
  }

  // &:focus{
  //   background-color: ${theme.palette.primary.light}};
  // }

  &.${buttonUnstyledClasses.focusVisible} {
    // color: #fff;
    outline: none;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    color: black;
  }

  &.${buttonUnstyledClasses.disabled} {
    cursor: not-allowed;
  }
`;
});

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
  // background-color: black;
`;

export default function PackingQueueTabs({
  queueData,
  onQueueRowClick,
  selectedOrderNumber,
  selectionOrderIds,
}) {
  const classes = useStyle();
  return (
    <Box className={classes.tab} borderRadius="16px" p={2}>
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
            selectionOrderIds={selectionOrderIds}
          />
        </TabPanel>
        <TabPanel value={1}>
          <HistoryTable />
        </TabPanel>
      </TabsUnstyled>
    </Box>
  );
}
