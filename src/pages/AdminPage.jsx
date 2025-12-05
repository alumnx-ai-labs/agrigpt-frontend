import React, { useState } from 'react';

const AdminPage = () => {
  const [selectedOption, setSelectedOption] = useState('Citrus Crop');
  const [showDropdown, setShowDropdown] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const options = ['Citrus Crop', 'Government Schemes'];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
    setUploadSuccess(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Simulate upload process
      setUploadSuccess(true);
    }
  };

  const getInstructionText = () => {
    if (selectedOption === 'Citrus Crop') {
      return 'Select the pdf file containing the Citrus Crop Data for Ingestion into the RAG database';
    } else {
      return 'Select the pdf file containing the Government Schemes Data for Ingestion into the RAG database';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#e8e4e1',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        maxWidth: '1200px',
        width: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          marginBottom: '3rem',
          fontWeight: 'bold'
        }}>
          AgriGPT SME AI Consultant
        </h1>

        {/* Dropdown Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <label style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            minWidth: '200px'
          }}>
            Select an option
          </label>
          
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f0e6e6',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.25rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {selectedOption}
              <span style={{ fontSize: '1.5rem' }}>▼</span>
            </button>

            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '0.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 10
              }}>
                {options.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      backgroundColor: option === selectedOption ? '#f0e6e6' : 'white',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseEnter={(e) => {
                      if (option !== selectedOption) {
                        e.target.style.backgroundColor = '#f5f5f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (option !== selectedOption) {
                        e.target.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upload Section */}
        <div style={{
          backgroundColor: '#f0f0f0',
          padding: '2.5rem',
          marginBottom: '2rem',
          borderRadius: '4px'
        }}>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0,
            lineHeight: '1.6'
          }}>
            {getInstructionText()}
          </p>
        </div>

        {/* Upload Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '2rem'
        }}>
          <label style={{
            backgroundColor: '#4c51bf',
            color: 'white',
            padding: '0.875rem 3rem',
            borderRadius: '50px',
            fontSize: '1.25rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-block'
          }}>
            Upload
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              onClick={handleUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div style={{
            backgroundColor: '#b2d8d8',
            padding: '2rem',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: 0
            }}>
              Thank you! The PDF file has been successfully ingested.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;