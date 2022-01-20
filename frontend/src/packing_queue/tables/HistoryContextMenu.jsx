import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

export default function HistoryRowContextMenu({menuPosition, setMenuPosition}) {
  const open = Boolean(menuPosition)

  const handleClose = (event) => {
    setMenuPosition(null);
  };

  return (
        <Menu
          open={open}
          anchorReference="anchorPosition"
          anchorPosition={menuPosition}
          anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
          }}
          onClose={handleClose}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          <MenuItem>View</MenuItem>
          <MenuItem>Download</MenuItem>
          <MenuItem>Edit</MenuItem>
          <MenuItem>Delete</MenuItem>
        </Menu>
  );
}
