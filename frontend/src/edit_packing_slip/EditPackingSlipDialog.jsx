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
    >
      <EditPackingSlipTable
        rowData={packingSlipData}
        onAdd={onAdd}
        onDelete={onDelete}
        onNewOrderNumRowChange={onNewOrderNumRowChange}
        onNewPartRowChange={onNewPartRowChange}
        onPackQtyChange={onPackQtyChange}
        viewOnly={viewOnly}
      />
    </PackingDialog>
  );
};

export default EditPackingSlipDialog;
