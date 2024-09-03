import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC<{ onLoginSuccess: (id: number, role: string) => void }> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password
            });

            console.log('Login response:', response.data);

            // Check the role and pass the corresponding ID
            if (response.data.role === 'Administrator') {
                console.log('Admin ID:', response.data.admin.admin_id);
                onLoginSuccess(response.data.admin.admin_id, 'Administrator'); // Pass admin_id and role to App
                navigate('/dashboard'); // Redirect to admin dashboard
            } else if (response.data.role === 'Coordinator') {
                console.log('Coordinator ID:', response.data.coordinator.coordinator_id);
                onLoginSuccess(response.data.coordinator.coordinator_id, 'Coordinator'); // Pass coordinator_id and role to App
                navigate('/coordinator-dashboard'); // Redirect to coordinator dashboard
            } else {
                setMessage(`Login successful as ${response.data.role}`);
                navigate('/dashboard'); // Redirect to dashboard for other roles
            }
        } catch (error) {
            setMessage(error.response?.data.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;