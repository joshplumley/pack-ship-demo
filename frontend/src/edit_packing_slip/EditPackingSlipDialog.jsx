import PackingDialog from "../components/PackingDialog";
import EditPackingSlipTable from "./components/EditPackingSlipTable";

const EditPackingSlipDialog = ({
  packingSlipData,
  isOpen,
  onClose,
  onSubmit,
  onAdd,
  onDelete,
  onNewOrderNumRowChange,
  onNewPartRowChange,
  onPackQtyChange,
  setCellEditing,
  cellEditing = false,
  viewOnly = true,
}) => {
  return (
    <PackingDialog
      open={isOpen}
      titleText={`${viewOnly ? "" : "Edit Packing Slip / "}${
        packingSlipData?.packingSlipId
      }`}
      onClose={onClose}
      onSubmit={onSubmit}
      submitDisabled={cellEditing}
    >
      <EditPackingSlipTable
        rowData={packingSlipData}
        onAdd={onAdd}
        onDelete={onDelete}
        onNewOrderNumRowChange={onNewOrderNumRowChange}
        onNewPartRowChange={onNewPartRowChange}
        onPackQtyChange={onPackQtyChange}
        setEditing={setCellEditing}
        viewOnly={viewOnly}
      />
    </PackingDialog>
  );
};

export default EditPackingSlipDialog;
