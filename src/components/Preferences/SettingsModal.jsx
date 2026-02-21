import React, { useState } from 'react';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose, onSave, initialName, onLogout }) {
    const [name, setName] = useState(initialName || '');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(name);
        onClose();
    };

    return (
        <div className="settings-modal-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <h3>Preferences</h3>
                    <button className="settings-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="form-group">
                        <label htmlFor="userName">What should we call you?</label>
                        <input
                            id="userName"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Enter your name"
                            maxLength="30"
                        />
                    </div>
                    <div className="settings-actions">
                        <button type="button" className="btn-logout" onClick={onLogout}>Logout</button>
                        <button type="submit" className="btn-save">Save Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
