import { useState } from 'react';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export const useFileUpload = (uploadUrl: string, acceptedTypes: string[], maxSizeMB = 10) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [error, setError] = useState<string | null>(null);

  const selectFile = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      setError('Invalid file type.');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError('File is too large.');
      return;
    }

    setFile(file);
    setError(null);
  };

  const uploadFile = async () => {
    if (!file) return;
    setUploadState('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      setUploadState('success');
    } catch (err: any) {
      setError(err.message);
      setUploadState('error');
    }
  };

  return {
    file,
    selectFile,
    uploadFile,
    uploadState,
    error,
  };
};