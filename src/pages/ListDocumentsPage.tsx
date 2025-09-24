import {
  useState,
  useEffect,
  type ReactEventHandler,
  type ChangeEvent,
} from "react";
import type { Document } from "../data/types";
import { getDocuments, deleteDocument } from "../data/document.api";
import DataTable from "../components/DataTable";
import { PAGE_UPLOAD } from "../constants";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmationModal from "../components/ConfirmationModal";
import Input from "@mui/material/Input";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CustomSnackbar from "../components/feedback/CustomSnackbar";

interface ListDocuementsPageProps {
  handleChangePage: (page: string) => void;
}

const ListDocumentsPage = ({ handleChangePage }: ListDocuementsPageProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null
  );
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");

  // search bar
  const [searchValue, setSearchValue] = useState<string>("");
  // snack bar
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const handleDelete = () => {
    if (selectedDocumentId === null) return;

    setModalOpen(false);
    console.log("Delete document with id:", selectedDocumentId);
    deleteDocument(selectedDocumentId)
      .then(() => {
        const newDocumentsList = documents.filter(
          (doc) => doc.id !== selectedDocumentId
        );
        setDocuments([...newDocumentsList]);
        setFilteredDocuments([...newDocumentsList]);
        setSearchValue("");
        setSelectedDocumentId(null);
        setIsSnackbarOpen(true); // repeated code
        setSnackbarMessage("Document deleted successfully");
      })
      .catch((error) => {
        setSelectedDocumentId(null);
        setIsSnackbarOpen(true); // repeated code
        setSnackbarMessage(`Document could not be deleted: ${error}`);
      });
  };

  const handleCancel = () => {
    setSelectedDocumentId(null);
    setModalOpen(false);
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
          variant="outlined"
          startIcon={<AddIcon />}
        >
          Add Document
        </Button>
      </div>
      <DataTable
        data={filteredDocuments}
        defaultRowsPerPage={5}
        handleModalOpen={setModalOpen}
        setModalTitle={setModalTitle}
        setModalMessage={setModalMessage}
        selectRow={setSelectedDocumentId}
        searchValue={searchValue}
      />
      <ConfirmationModal
        open={isModalOpen}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleDelete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ListDocumentsPage;
