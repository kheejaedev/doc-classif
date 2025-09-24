import type { GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import CustomStatusBar from "./CustomStatusBar";

export const insDocColDef: GridColDef[] = [
  {
    field: "originalName",
    headerName: "File name",
    width: 360,
  },
  {
    field: "size",
    headerName: "File size",
    type: "number",
    width: 120,
    headerAlign: "right",
    align: "right",
    valueFormatter: (value: number) => {
      const rawString = value.toString().replace(/,/g, "");
      const bytes = parseInt(rawString, 10);
      if (isNaN(bytes)) return value;

      const units = ["B", "KB", "MB", "GB", "TB"];
      let size = bytes;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${size.toFixed(2).replace(/\.?0+$/, "")} ${units[unitIndex]}`;
    },
  },
  {
    field: "createdAt",
    headerName: "Date created",
    width: 140,
    headerAlign: "right",
    align: "right",
    valueFormatter: (value) => {
      const date = new Date(value);
      return dayjs(date).format("MMM D, YYYY");
    },
  },
  {
    field: "classification",
    headerName: "Classification",
    width: 140,
    headerAlign: "right",
    align: "right",
  },
  {
    field: "confidence",
    headerName: "Accuracy",
    width: 120,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return CustomStatusBar({ value: params.value * 100 });
    },
  },
];
