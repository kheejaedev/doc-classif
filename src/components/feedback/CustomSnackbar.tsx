import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

interface CustomSnackbarProps {
  snackbarState: {
    open: boolean;
    horizontal: "center" | "left" | "right";
    vertical: "bottom" | "top";
  };
  snackbarMessage: string;
  setIsOpen: (isOpen: boolean) => void;
}

export default function CustomSnackbar({
  snackbarState,
  snackbarMessage = "",
  setIsOpen,
}: CustomSnackbarProps) {
  const { vertical, horizontal, open } = snackbarState;

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={() => setIsOpen(false)}
        message={snackbarMessage}
        key={vertical + horizontal}
        autoHideDuration={2000}
      />
    </Box>
  );
}
