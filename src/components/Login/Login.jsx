import React, { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!phone) {
            setError('Please enter your phone number.');
            return;
        }
        if (phone.length < 10) {
            setError('Phone number must be at least 10 digits.');
            return;
        }
        setError('');
        onLogin(phone);
    };

    const handlePhoneChange = (e) => {
        // Only allow numbers
        const value = e.target.value.replace(/\D/g, '');
        setPhone(value);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <div className="login-logo">🌾</div>
                    <h2>Welcome to FarmChat</h2>
                    <p>Your AI Crop Advisor</p>
                </div>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="Enter your 10-digit number"
                            maxLength="10"
                            autoFocus
                        />
                        {error && <span className="error-msg">{error}</span>}
                    </div>
                    <button type="submit" className="login-btn">Log In</button>
                </form>
            </div>
        </div>
    );
}
