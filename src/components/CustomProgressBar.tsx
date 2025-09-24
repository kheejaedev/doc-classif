import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export default function CustomProgressBar({
  currentProgress,
  action,
}: {
  currentProgress: number;
  action: string;
}) {
  const actionInProgress = () => {
    if (action === "delete") {
      return "Deleting... ";
    } else if (action === "upload") {
      return "Uploading... ";
    } else {
      return "";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress variant="determinate" value={currentProgress} />
      <Typography variant="caption" gutterBottom sx={{ display: "block" }}>
        {actionInProgress()} {currentProgress}% completed
      </Typography>
    </Box>
  );
}
