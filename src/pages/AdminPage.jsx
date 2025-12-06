import React, { useState } from 'react';

const AdminPage = () => {
  const [selectedOption, setSelectedOption] = useState('Citrus Crop');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const options = ['Citrus Crop', 'Government Schemes'];

  // API base URL - uses environment variable for flexibility
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else if (file) {
      setError('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      // Determine endpoint based on selected option
      let endpoint;
      if (selectedOption === 'Citrus Crop') {
        endpoint = `${API_URL}/upload-crop-data`;
      } else if (selectedOption === 'Government Schemes') {
        endpoint = `${API_URL}/upload-government-schemes`;
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Selected option:', selectedOption);
      console.log('Uploading to:', endpoint);
      console.log('File:', selectedFile.name);
      console.log('File type:', selectedFile.type);
      console.log('File size:', selectedFile.size);

      // Make API call to the appropriate endpoint
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      // Try to get response body regardless of status
      let responseData;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      console.log('Response data:', responseData);

      if (!response.ok) {
        const errorMessage = typeof responseData === 'object'
          ? (responseData?.detail || responseData?.message || JSON.stringify(responseData))
          : responseData;
        throw new Error(`Upload failed (${response.status}): ${errorMessage}`);
      }

      console.log('Upload successful');

      setUploadSuccess(true);
      setSelectedFile(null);

      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getInstructionText = () => {
    if (selectedOption === 'Citrus Crop') {
      return 'Upload PDF files containing Citrus Crop data for ingestion into the RAG database.';
    } else {
      return 'Upload PDF files containing Government Schemes data for ingestion into the RAG database.';
    }
  };

  return (
    <div className="page-container flex items-center justify-center p-6">
      <div className="content-card w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="empty-state-icon" style={{ width: '2.5rem', height: '2.5rem', marginBottom: 0 }}>
            ⚙️
          </div>
          <div>
            <h1 className="text-xl font-semibold text-notion-default tracking-tight">Admin Panel</h1>
            <p className="text-sm text-notion-secondary">Upload documents to build the knowledge base</p>
          </div>
        </div>

        {/* Topic Selector */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-notion-secondary mb-1.5 uppercase tracking-wide">
            Select Category
          </label>
          <select
            className="select-notion max-w-xs"
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setUploadSuccess(false);
              setSelectedFile(null);
              setError(null);
            }}
            disabled={uploading}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Instructions */}
        <div className="bg-notion-bg-gray p-4 rounded-lg mb-6 border border-[rgba(55,53,47,0.09)]">
          <p className="text-sm text-notion-secondary">
            {getInstructionText()}
          </p>
        </div>

        {/* Dropzone */}
        <div className="dropzone-notion relative mb-6">
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <div className="text-center">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm text-notion-secondary">
              <span className="text-notion-default font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-notion-tertiary mt-1">PDF files only</p>
          </div>
        </div>

        {/* Selected File Display */}
        {selectedFile && (
          <div className="flex items-center gap-3 p-3 bg-notion-bg-hover rounded-lg mb-4">
            <span className="text-xl">📎</span>
            <div className="flex-1">
              <p className="text-sm text-notion-default font-medium">{selectedFile.name}</p>
              <p className="text-xs text-notion-tertiary">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              className="btn-notion btn-notion-default"
              onClick={() => {
                setSelectedFile(null);
                const fileInput = document.getElementById('file-input');
                if (fileInput) fileInput.value = '';
              }}
            >
              Remove
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="message-error mb-4">
            <p className="text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="badge-success py-3 px-4 rounded-lg mb-4 flex items-center gap-2">
            <span>✓</span>
            <span>PDF file has been successfully ingested!</span>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="btn-notion btn-notion-primary px-6 py-2.5"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="spinner-notion border-white border-t-transparent" style={{ width: '16px', height: '16px' }}></span>
                Uploading...
              </span>
            ) : (
              'Upload PDF'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;