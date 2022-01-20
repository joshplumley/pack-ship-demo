import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup';


export default function DeleteAlert({deleteDialog, setDeleteDialog, setMenuPosition}) {
  const open = Boolean(deleteDialog)

  const handleClose = () => {
    setDeleteDialog(false);
    setMenuPosition(null)
  };

  const handleDelete = () => {
    setDeleteDialog(false)
    setMenuPosition(null)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do You Want To Delete This?"}
        </DialogTitle>
        {/* <DialogActions> */}
        <ButtonGroup textAlign='center'>
            <Button onClick={handleClose}>No</Button>
            <Button onClick={handleDelete} autoFocus>Yes</Button>
        </ButtonGroup>
        {/* </DialogActions> */}
      </Dialog>
    </div>
  );
}
