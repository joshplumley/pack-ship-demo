import React, { useState, useEffect } from "react";
import PackingSlipTable from "./components/PackingSlipTable";
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

  function isSubmittable() {
    return filledForm.every((e) => e.packQty && e.packQty >= 0);
  }

  return (
    <PackingDialog
      open={open}
      titleText={`Create Packing Slip for ${orderNum}`}
      onClose={onClose}
      onBackdropClick={onClose}
      onSubmit={submitPackingSlip}
      submitDisabled={!isSubmittable()}
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
