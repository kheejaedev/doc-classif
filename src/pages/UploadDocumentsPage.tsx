import FileUploader from "../components/FileUploader";
import type { FileUploaderRef } from "../components/FileUploader";
import { uploadDocument } from "../data/document.api";
import { PAGE_LIST } from "@/constants";
import { useRef, useState } from "react";
import Button from "@mui/material/Button";
import CustomProgressBar from "../components/CustomProgressBar";

interface UploadDocumentsPageProps {
  handleChangePage: (page: string) => void;
}

const UploadDocumentsPage = ({
  handleChangePage,
}: UploadDocumentsPageProps) => {
  const fileUploaderRef = useRef<FileUploaderRef>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const goToListDocumentsPage = () => {
    handleChangePage(PAGE_LIST);
  };

  const clearUploading = () => {
    setIsUploading(false);
    setProgress(0);
  };

  const handleUpload = async () => {
    const files = fileUploaderRef.current?.getFilesToUpload();

    if (files && files.length) {
      setIsUploading(true);
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          await uploadDocument(file);
          const progressValue = Math.round(((i + 1) / files.length) * 100);
          setProgress(progressValue);
        }
        goToListDocumentsPage();
        clearUploading();
      } catch (error) {
        console.error("Error uploading files:", error);
        clearUploading();
      }
    }
  };

  return (
    <div>
      {isUploading && (
        <div>
          <CustomProgressBar currentProgress={progress} action="upload" />
        </div>
      )}
      <div>
        <FileUploader ref={fileUploaderRef} />
      </div>
      <div
        padding-top={2}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "16px",
        }}
      >
        <Button size="small" variant="contained" onClick={() => handleUpload()}>
          Submit
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => goToListDocumentsPage()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UploadDocumentsPage;
