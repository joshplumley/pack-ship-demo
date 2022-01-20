import React from "react";
import { styled } from "@mui/system";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import Tabs from "@mui/material/Tabs";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import { buttonUnstyledClasses } from "@mui/base/ButtonUnstyled";
import TabUnstyled, { tabUnstyledClasses } from "@mui/base/TabUnstyled";
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

export default function PackShipTabs({
  onTabChange,
  queueData,
  queueTab,
  historyTab,
}) {
  const classes = useStyle();
  return (
    <Box className={classes.tab} borderRadius="16px" p={2} height="fit-content">
      <TabsUnstyled defaultValue={0}>
        <Tabs onChange={onTabChange}>
          <Tab value={0}>Queue ({queueData.length})</Tab>
          <Tab value={1}>History</Tab>
        </Tabs>
        <TabPanel value={0}>{queueTab}</TabPanel>
        <TabPanel value={1}>{historyTab}</TabPanel>
      </TabsUnstyled>
    </Box>
  );
}
