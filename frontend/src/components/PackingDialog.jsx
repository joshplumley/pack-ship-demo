import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from "@mui/material";
import CommonButton from "../common/Button";
import CloseIcon from "@mui/icons-material/Close";

const PackingDialog = ({
  titleText,
  onClose,
  onSubmit,
  open,
  progressText = "Ok",
  fullWidth = true,
  actions,
  children,
}) => {
  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth="xl"
      open={open}
      onClose={onClose}
      onBackdropClick={onClose}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography align="center" fontWeight="bold" fontSize={20}>
          {titleText}
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
      <DialogContent>{children}</DialogContent>
      {actions !== undefined ? (
        actions
      ) : (
        <DialogActions>
          <CommonButton onClick={onClose} label="Cancel" />
          <CommonButton autoFocus onClick={onSubmit} label={progressText} />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PackingDialog;
