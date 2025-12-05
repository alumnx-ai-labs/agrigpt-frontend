import React, { useState } from 'react';
import { FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import FileUpload from './FileUpload';
import Button from './Button';
import './Sidebar.css';

const Sidebar = ({ onUploadPDF, onClearKnowledge, isConnected }) => {
    const [uploadStatus, setUploadStatus] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    const handleUpload = async (file) => {
        setIsUploading(true);
        setUploadStatus(null);

        try {
            const result = await onUploadPDF(file);
            setUploadStatus({
                type: 'success',
                message: `Added ${result.chunks} chunks to knowledge base`,
            });
        } catch (error) {
            setUploadStatus({
                type: 'error',
                message: error.message || 'Upload failed',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = async () => {
        if (!window.confirm('Are you sure you want to clear the knowledge base?')) {
            return;
        }

        setIsClearing(true);
        try {
            await onClearKnowledge();
            setUploadStatus({
                type: 'success',
                message: 'Knowledge base cleared successfully',
            });
        } catch (error) {
            setUploadStatus({
                type: 'error',
                message: error.message || 'Failed to clear knowledge base',
            });
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <>
        {/* <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">Knowledge Base</h2>
                <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    <span className="status-dot"></span>
                    <span className="status-text">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div> */}

            <div className="sidebar-content">
                <div className="upload-section">
                    <h3 className="section-title">Upload Document</h3>
                    <FileUpload onUpload={handleUpload} isUploading={isUploading} />

                    {uploadStatus && (
                        <div className={`status-message ${uploadStatus.type}`}>
                            {uploadStatus.type === 'success' ? (
                                <FiCheckCircle className="status-icon" />
                            ) : (
                                <FiAlertCircle className="status-icon" />
                            )}
                            <span>{uploadStatus.message}</span>
                        </div>
                    )}
                </div>

                {/* <div className="divider"></div> */}

                {/* <div className="actions-section">
                    <Button
                        variant="danger"
                        icon={<FiTrash2 />}
                        onClick={handleClear}
                        loading={isClearing}
                        fullWidth
                        size="medium"
                    >
                        Clear Knowledge Base
                    </Button>
                </div> */}
            </div>

            {/* <div className="sidebar-footer">
                <p className="footer-text">
                    Upload PDF documents to chat with their content
                </p>
            </div> */}
        {/* </div> */}
        </>
    );
};

export default Sidebar;
