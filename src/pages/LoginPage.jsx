import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        // Simulate authentication delay
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            if (isLogin) {
                // Accept any email/password for demo purposes
                console.log('Logged in with:', email);
                // Redirect to consultant page after login
                navigate('/consultant');
            } else {
                // Simulate signup
                console.log('Created account for:', email);
                setMessage('Account created! You can now log in.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgb(227,226,224)] rounded-2xl mb-4 text-4xl">
                        🌾
                    </div>
                    <h1 className="text-2xl font-semibold text-notion-default">AgriGPT</h1>
                    <p className="text-notion-secondary text-sm mt-1">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </p>
                </div>

                {/* Card */}
                <div className="card-notion p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-notion-default mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                className="input-notion"
                                placeholder="Enter your email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-notion-default mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                className="input-notion"
                                placeholder="Enter your password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="badge-error text-sm py-2 px-3 rounded-md">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="badge-success text-sm py-2 px-3 rounded-md">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full btn-notion btn-notion-primary py-2.5 justify-center mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-notion border-white border-t-transparent"></span>
                            ) : (
                                isLogin ? 'Continue with email' : 'Create account'
                            )}
                        </button>
                    </form>
                </div>

                {/* Toggle */}
                <p className="text-center mt-6 text-sm text-notion-secondary">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                        className="ml-1 text-notion-default hover:underline font-medium"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
