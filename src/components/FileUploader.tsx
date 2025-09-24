import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { useState, forwardRef, useImperativeHandle } from 'react';

export interface FileUploaderRef {
  getFilesToUpload: () => File[] | undefined;
}

const FileUploader = forwardRef<FileUploaderRef>(({}, ref) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  useImperativeHandle(ref, () => ({
    getFilesToUpload: () => files,
  }));

  return (
    <div>
      <Dropzone
        maxFiles={10}
        onDrop={handleDrop}
        onError={console.error}
        src={files}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </div>
  );
});

export default FileUploader;