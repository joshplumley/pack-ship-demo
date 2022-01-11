const PopupDialog = ({
  titleText,
  onClose,
  submitPackingSlip,
  open,
  children,
}) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={open}
      onClose={onClose}
      onBackdropClick={onClose}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography align="center">{titleText}</Typography>
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
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" autoFocus onClick={submitPackingSlip}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupDialog;
