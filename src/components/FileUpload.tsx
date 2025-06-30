
import React, { useCallback, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setUploadedFile(file);
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setUploadedFile(file);
        onFileUpload(file);
      }
    }
  }, [onFileUpload]);

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 scale-105'
            : uploadedFile
            ? 'border-green-500 bg-green-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {uploadedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <FileText className="w-16 h-16 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">File Uploaded Successfully</h3>
              <p className="text-green-700 font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-green-600 mt-1">
                Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              onClick={removeFile}
              variant="outline"
              className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Upload className={`w-16 h-16 ${dragActive ? 'text-blue-500' : 'text-slate-400'} transition-colors duration-300`} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                {dragActive ? 'Drop your CSV file here' : 'Upload Flight Data CSV'}
              </h3>
              <p className="text-slate-500 mb-4">
                Drag and drop your CSV file or click to browse
              </p>
              <div className="text-sm text-slate-400">
                <p>Supported format: CSV files only</p>
                <p>Maximum file size: 100MB</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
