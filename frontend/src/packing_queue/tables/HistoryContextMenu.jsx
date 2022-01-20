import React, { useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import DeleteAlert from './DeleteMenu'

export default function HistoryRowContextMenu({menuPosition, setMenuPosition}) {
  const open = Boolean(menuPosition)
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleClose = (event) => {
    setMenuPosition(null);
  };

  const openDeleteDialog = (event) => {
      setDeleteDialog(true)
  }

  return (
      <div>
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
          <MenuItem onClick={openDeleteDialog}>Delete</MenuItem>
        </Menu>
        {/* <ContextMenu deleteDialog={deleteDialog} setDeleteDialog={setDeleteDialog} setMenuPosition={setMenuPosition}/> */}
        </div>
  );
}
