import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CustomProgressBar from "./CustomProgressBar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ConfirmationModal = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  currentProgress,
  action,
}: any) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={onCancel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {message}
          </Typography>
          {currentProgress > 0 && (
            <div style={{ marginTop: "1em" }}>
              <CustomProgressBar
                currentProgress={currentProgress}
                action={action}
              />
            </div>
          )}
          <div
            padding-top={2}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            <Button variant="contained" onClick={() => onConfirm()}>
              Confirm
            </Button>
            <Button variant="outlined" onClick={() => onCancel()}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
