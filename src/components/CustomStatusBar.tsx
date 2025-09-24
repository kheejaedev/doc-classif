import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export default function CustomStatusBar({ value }: { value: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "right",
      }}
    >
      <LinearProgress
        style={{ width: "3.6em" }}
        variant="determinate"
        value={value}
        color={value > 60 ? "primary" : "secondary"}
      />{" "}
      <div style={{ marginLeft: "0.4em" }}>
        <Typography variant="caption" sx={{ display: "block" }}>
          {value}%
        </Typography>
      </div>
    </div>
  );
}
