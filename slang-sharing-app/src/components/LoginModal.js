import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ show, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (isRegistering) {
            registerUser();
        } else {
            loginUser();
        }
    };

    const loginUser = () => {
        if (username === 'admin' && password === 'admin') {
            alert('Login successful');
            onClose();
            navigate('/add-slang'); // Navigate to AddSlang page
        } else {
            alert('Invalid username or password');
        }
    };

    const registerUser = () => {
        if (email !== confirmEmail) {
            alert('Emails do not match');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch('/checkUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                alert('User already exists');
            } else {
                createAccount(email, password);
            }
        })
        .catch(error => console.error('Check user failed:', error));
    };

    const createAccount = (email, password) => {
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration successful');
                loginUser(email, password);  // Log the user in automatically
                navigate('/add-slang'); // Navigate to AddSlang page
            } else {
                alert('Registration failed');
            }
        })
        .catch(error => console.error('Registration failed:', error));
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                {isRegistering && (
                    <>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Confirm Email"
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                        />
                    </>
                )}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {isRegistering && (
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <button onClick={handleLogin}>{isRegistering ? 'Register' : 'Login'}</button>
                <button onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Switch to Login' : 'Switch to Register'}
                </button>
            </div>
        </div>
    );
};

export default LoginModal;