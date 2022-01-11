import React, { useState, useEffect } from "react";
import PackingSlipTable from "./components/PackingSlipTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { API } from "../services/server";

const PackingSlipDialog = ({ open, onClose, orderNum, parts }) => {
  const [filledForm, setFilledForm] = useState([]);

  useEffect(() => {
    setFilledForm(parts);
  }, [parts]);

  async function submitPackingSlip() {
    const items = filledForm.map((e) => {
      return { item: e.id, qty: e.packQty };
    });
    API.createPackingSlip(items, filledForm[0].customer, orderNum)
      .then(onClose())
      .catch(() => {
        alert("An error occurred submitting packing slip");
      });
  }

  function isSubmittable() {
    return filledForm.every((e) => e.packQty && e.packQty >= 0);
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={onClose}
      onBackdropClick={onClose}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography align="center">
          Create Packing Slip for Order #{orderNum}
        </Typography>
        <IconButton
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <PackingSlipTable
          rowData={parts}
          filledForm={filledForm}
          setFilledForm={setFilledForm}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!isSubmittable()}
          autoFocus
          onClick={submitPackingSlip}
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PackingSlipDialog;
