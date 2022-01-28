import React, { useState, useEffect } from "react";
import PackingSlipTable from "./components/PackingSlipTable";
import PackingDialog from "../components/PackingDialog";

const PackingSlipDialog = ({ onSubmit, open, onClose, orderNum, parts, viewOnly=false }) => {
  const [filledForm, setFilledForm] = useState([]);

  useEffect(() => {
    setFilledForm(parts);
  }, [parts]);

  function isSubmittable() {
    return filledForm.every((e) => e.packQty && e.packQty >= 0);
  }

  return (
    <PackingDialog
      open={open}
      titleText={`Create Packing Slip for ${orderNum}`}
      onClose={onClose}
      onBackdropClick={onClose}
      onSubmit={() => onSubmit(filledForm, orderNum)}
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
