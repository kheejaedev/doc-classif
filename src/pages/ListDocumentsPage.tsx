import { useState, useEffect } from 'react';
import type { Document } from '../data/types';
import { getDocuments, deleteDocument } from '../data/document.api';
import DataTable from '../components/DataTable';
import { PAGE_UPLOAD } from '../constants';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import ConfirmationModal from '../components/ConfirmationModal';

interface ListDocuementsPageProps {
    handleChangePage: (page: string) => void;
}

const ListDocumentsPage = ({handleChangePage} : ListDocuementsPageProps) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [modalMessage, setModalMessage] = useState<string>('');

    const handleDelete = () => {
        if (selectedDocumentId === null) return;

        setModalOpen(false);
        console.log("Delete document with id:", selectedDocumentId);
        deleteDocument(selectedDocumentId)
            .then(() => {
                console.log('Document deleted successfully');
                const newDocumentsList = documents.filter(doc => doc.id !== selectedDocumentId);
                setDocuments([ ... newDocumentsList ]);
                setSelectedDocumentId(null);
            })
            .catch((error) => {
                console.error('Could not delete document:', error);
                setSelectedDocumentId(null);
            });
    }

    const handleCancel = () => {
        setSelectedDocumentId(null);
        setModalOpen(false);
    }

    useEffect(() => {
        getDocuments()
            .then((documents) => {
                setDocuments(documents)
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Could not fetch documents:', error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <CircularProgress />;
    }
    
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    onClick={() => handleChangePage(PAGE_UPLOAD)}
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    style={{ marginBottom: '16px' }}>
                        Add Document
                </Button>
            </div>
            <DataTable
                data={documents}
                defaultRowsPerPage={5}
                handleModalOpen={setModalOpen}
                setModalTitle={setModalTitle}
                setModalMessage={setModalMessage}
                selectRow={setSelectedDocumentId}
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
}

export default ListDocumentsPage;