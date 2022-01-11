import PackingDialog from "../components/PackingDialog";
import EditPackingSlipTable from "./components/EditPackingSlipTable";

const EditPackingSlipDialog = ({ open, onClose, orderNum, parts }) => {
  const [filledForm, setFilledForm] = useState([]);

  useEffect(() => {
    setFilledForm(parts);
  }, [parts]);

  return (
    <PackingDialog
      titleText={`Create Packing Slip for Order #${orderNum}`}
      onClose={onClose}
      submitPackingSlip={submitPackingSlip}
      open={open}
    >
      <EditPackingSlipTable
        rowData={parts}
        filledForm={filledForm}
        setFilledForm={setFilledForm}
      />
    </PackingDialog>
  );
};

export default EditPackingSlipDialog;
