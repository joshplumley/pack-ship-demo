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
import PackingDialog from "../components/PackingDialog";

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

  return (
    <PackingDialog
      titleText={`Create Packing Slip for Order #${orderNum}`}
      onClose={onClose}
      submitPackingSlip={submitPackingSlip}
      open={open}
    >
      <PackingSlipTable
        rowData={parts}
        filledForm={filledForm}
        setFilledForm={setFilledForm}
      />
    </PackingDialog>
  );
};

export default PackingSlipDialog;
