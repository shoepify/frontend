import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const LoginForm = ({ onClose }) => {
    const { login } = useUser();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');

    const handleLogin = () => {
        if (username && password) {
            login(role);
            onClose();
        } else {
            alert('Please enter a username and password');
        }
    };

    return (
        <div className="text-center">
            <h2>Login</h2>
            <input
                type="text"
                className="form-control my-2"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                className="form-control my-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select
                className="form-select my-2"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="admin">Admin</option>
                <option value="productManager">Product Manager</option>
                <option value="salesManager">Sales Manager</option>
                <option value="customer">Customer</option>
            </select>
            <button className="btn btn-primary mt-3" onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginForm;
