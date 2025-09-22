import type { HeadCell } from "./types";

export const headCells: readonly HeadCell[] = [
  {
    id: 'originalName',
    numeric: false,
    disablePadding: true,
    label: 'File Name',
    alignRight: false,
  },
  {
    id: 'classification',
    numeric: false,
    disablePadding: true,
    label: 'Type',
    alignRight: false,
  },
  {
    id: 'confidence',
    numeric: true,
    disablePadding: true,
    label: 'Confidence',
    alignRight: true,
  },
  {
    id: 'size',
    numeric: true,
    disablePadding: true,
    label: 'File Size',
    alignRight: true,
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: true,
    label: 'Date Created',
    alignRight: true,
  },
];