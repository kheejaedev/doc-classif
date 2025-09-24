import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import type { InsuranceDocument } from "../data/types";
import { DataGrid } from "@mui/x-data-grid";
// import type { GridColDef } from "@mui/x-data-grid";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from "@mui/material/Button";
import type {
  GridRowSelectionModel,
  // GridCallbackDetails,
} from "@mui/x-data-grid";

const paginationModel = { page: 0, pageSize: 5 };

// interface DataTableProps {
//   onRequestSort: (
//     event: React.MouseEvent<unknown>,
//     property: keyof InsuranceDocument
//   ) => void;
//   order: Order;
//   orderBy: string;
// }

// interface DataTableProps {
//   colDefs: GridColDef;
//  handleRowSelectionModelChange: function(rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => void
// }

const CustomTable = ({
  data,
  searchValue,
  colDefs,
  handleDeleteSelectedRows,
}: any) => {
  const [rows, setRows] = useState<InsuranceDocument[]>(data);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  console.log("search value - ", searchValue);

  useEffect(() => {
    setRows(data);
  }, [data]);

  useEffect(() => {}, [rows]);

  const handleRowSelectionModelChange = (
    rowSelectionModel: GridRowSelectionModel,
    // details: GridCallbackDetails
  ) => {
    const rowIds = [...rowSelectionModel.ids].map((id) => id.toString());
    setSelectedRowIds(rowIds);
  };

  const handleDelete = () => {
    handleDeleteSelectedRows(selectedRowIds);
  };

  console.log("rows - ", rows);
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <Button disabled={selectedRowIds.length === 0} onClick={handleDelete}>
          Delete
        </Button>
        <DataGrid
          rows={rows}
          columns={colDefs}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          onRowSelectionModelChange={handleRowSelectionModelChange}
          sx={{ border: 0 }}
          rowHeight={40}
        />
      </Paper>
    </Box>
  );
};

export default CustomTable;
