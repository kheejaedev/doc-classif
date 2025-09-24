import { useState, useEffect, type ChangeEvent } from "react";
import type { InsuranceDocument } from "../data/types";
import { getDocuments, deleteDocument } from "../data/document.api";
import CustomTable from "../components/CustomTable";
import { PAGE_UPLOAD } from "../constants";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationModal from "../components/ConfirmationModal";
import Input from "@mui/material/Input";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import CustomSnackbar from "../components/feedback/CustomSnackbar";
import { insDocColDef } from "../components/insDocColDef";
import CustomGrid from "../components/CustomGrid";

interface ListDocuementsPageProps {
  handleChangePage: (page: string) => void;
}

const ListDocumentsPage = ({ handleChangePage }: ListDocuementsPageProps) => {
  const [viewMode, setViewMode] = useState<string>("list");
  const [documents, setDocuments] = useState<InsuranceDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<
    InsuranceDocument[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // confirmation modal
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [confirmationModalDisplayInfo, setConfirmationModalDisplayInfo] =
    useState<{ title: string; message: string; action: string }>({
      title: "",
      message: "",
      action: "",
    });
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  // search bar
  const [searchValue, setSearchValue] = useState<string>("");

  // snack bar
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  // progress bar
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);

  const handleToggleView = () => {
    if (viewMode === "list") {
      setViewMode("grid");
    } else {
      setViewMode("list");
    }
  };

  const handleOpenDeleteConfirmationModal = (selectedRowIds: string[]) => {
    const numRowsSelected = selectedRowIds.length;
    const multipleRowsSelected = selectedRowIds.length > 1;

    setSelectedDocumentIds(selectedRowIds);

    setConfirmationModalDisplayInfo({
      title: `Delete Document${multipleRowsSelected ? "s" : ""}`,
      message: `Are you sure you want to delete ${
        multipleRowsSelected ? "these " : "this"
      }${multipleRowsSelected ? numRowsSelected : ""} selected document${
        multipleRowsSelected ? "s" : ""
      }? This action cannot be undone.`,
      action: "delete",
    });
    setIsConfirmationModalOpen(true);
  };

  const clearModalState = () => {
    setIsConfirmationModalOpen(false);
    setConfirmationModalDisplayInfo({ title: "", message: "", action: "" });
    setCurrentProgress(0);
  };

  const showSnackbar = (message: string) => {
    setIsSnackbarOpen(true);
    setSnackbarMessage(message);
  };

  const handleDeleteSelectedDocuments = async () => {
    if (selectedDocumentIds === null || selectedDocumentIds.length === 0)
      return;
    const numSelectedDocuments = selectedDocumentIds.length;

    try {
      for (let i = 0; i < numSelectedDocuments; i++) {
        const documentId: string = selectedDocumentIds[i];
        await deleteDocument(documentId);
        setCurrentProgress(Math.round(((i + 1) / numSelectedDocuments) * 100));
      }
      const newDocuments = documents.filter(
        (document) => !selectedDocumentIds.includes(document.id)
      );
      setDocuments(newDocuments);
      setFilteredDocuments(newDocuments);
      clearModalState();
      showSnackbar(
        `Document${numSelectedDocuments > 1 ? "s" : ""} deleted successfully`
      );
    } catch (error) {
      console.error("Error deleting files: ", error);
      clearModalState();
      showSnackbar(
        `Document${
          numSelectedDocuments > 1 ? "s" : ""
        } could not be deleted: ${error}`
      );
    }
  };

  const handleCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    const filteredDocuments = documents.filter((row) =>
      row.originalName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredDocuments([...filteredDocuments]);
  };

  useEffect(() => {
    getDocuments()
      .then((documents) => {
        setDocuments(documents);
        setFilteredDocuments(documents);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Could not fetch documents:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <CustomSnackbar
        snackbarState={{
          open: isSnackbarOpen,
          horizontal: "center",
          vertical: "top",
        }}
        setIsOpen={setIsSnackbarOpen}
        snackbarMessage={snackbarMessage}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Input
          placeholder="Search document"
          inputProps={{ "aria-label": "description" }}
          style={{ width: "60%", marginRight: "16px" }}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          onChange={handleSearchChange}
          value={searchValue}
        />
        <Button
          onClick={() => handleChangePage(PAGE_UPLOAD)}
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Document
        </Button>
        {/* <Button onClick={() => handleToggleView()}>Toggle View</Button> */}
      </div>
      {viewMode === "list" ? (
        <CustomTable
          data={filteredDocuments}
          searchValue={searchValue}
          colDefs={insDocColDef}
          handleDeleteSelectedRows={handleOpenDeleteConfirmationModal}
        />
      ) : (
        <CustomGrid
          data={filteredDocuments}
          searchValue={searchValue}
          handleDeleteSelectedRows={handleOpenDeleteConfirmationModal}
        />
      )}
      <ConfirmationModal
        open={isConfirmationModalOpen}
        title={confirmationModalDisplayInfo.title}
        message={confirmationModalDisplayInfo.message}
        onConfirm={handleDeleteSelectedDocuments}
        onCancel={handleCloseConfirmationModal}
        currentProgress={currentProgress}
        action={confirmationModalDisplayInfo.action}
      />
    </div>
  );
};

export default ListDocumentsPage;
