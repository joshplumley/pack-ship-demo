import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { API } from "../../services/server";


export default function DeleteAlert({deleteDialog, setDeleteDialog, selectedId}) {
  const open = Boolean(deleteDialog)

  const handleClose = () => {
    setDeleteDialog(false);
  };

  async function deletePackingSlip() {
    API.deletePackingSlip(selectedId)
      .then(handleClose())
      .catch(() => {
        alert("An error occurred deleting packing slip");
      });
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
          <Button onClick={deletePackingSlip} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
