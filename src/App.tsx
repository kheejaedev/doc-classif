import { useState } from 'react'
import './App.css'
import UploadDocumentsPage from './pages/UploadDocumentsPage';
import ListDocumentsPage from './pages/ListDocumentsPage';
import Typography from '@mui/material/Typography';
import { PAGE_LIST } from './constants';

const styles = {
  title: {
    marginBottom: '24px',
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>(PAGE_LIST);
  const handleChangePage = (page: string) => {
    setCurrentPage(page);
  }

  return (
    <div className="App">
      <div style={styles.title}>
        <Typography
          variant="h6"
          gutterBottom>
          Insurance Documents
        </Typography>
      </div>
      { currentPage === PAGE_LIST ? (
        <ListDocumentsPage handleChangePage={handleChangePage} />
      ) : (
        <UploadDocumentsPage handleChangePage={handleChangePage} />
      )}
    </ div>
  )
}

export default App
