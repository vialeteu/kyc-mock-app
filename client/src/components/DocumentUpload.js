import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadKycDocument } from '../api';

const DocumentUpload = ({ userId, onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadKycDocument(userId, file);
      if (response.success) {
        onUploadSuccess(response.data);
      }
    } catch (error) {
      onUploadError(error.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [userId, onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: uploading
  });

  return (
    <div className="card">
      <h2>Upload Identity Document</h2>
      <p>Please upload a valid ID document for KYC verification.</p>
      
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Uploading document...</p>
          </div>
        ) : isDragActive ? (
          <p>Drop the document here...</p>
        ) : (
          <div>
            <p>Drag and drop a document here, or click to select</p>
            <p><small>Supported formats: JPEG, PNG, PDF (max 5MB)</small></p>
            <p><strong>Tip:</strong> Files with "valid" in the name will be approved</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="alert alert-info">
          <p>Document is being uploaded and will be verified. This may take 2-20 seconds.</p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload; 