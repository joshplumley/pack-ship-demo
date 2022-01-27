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

const PackingSlipDialog = ({ onSubmit, open, onClose, orderNum, parts, viewOnly=false }) => {
  const [filledForm, setFilledForm] = useState([]);

  useEffect(() => {
    setFilledForm(parts);
  }, [parts]);

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
          {viewOnly ? "" : "Create "}Packing Slip for Order #{orderNum}
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
          viewOnly={viewOnly}
        />
      </DialogContent>
      {!viewOnly
        ?
        <DialogActions>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!isSubmittable()}
            autoFocus
            onClick={() => onSubmit(filledForm, orderNum)}
          >
            Ok
          </Button>
        </DialogActions>
        : undefined
      }
    </Dialog>
  );
};

export default PackingSlipDialog;
