import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup';


export default function DeleteAlert({deleteDialog, setDeleteDialog}) {
  const open = Boolean(deleteDialog)

  const handleClose = () => {
    setDeleteDialog(false);
  };

  const handleDelete = () => {
    setDeleteDialog(false)
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
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleClose} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
