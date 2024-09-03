import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CoordinatorLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/coordinator/login', {
                username,
                password
            });

            console.log('Login response:', response.data);

            // Check if the role is Coordinator and pass coordinator_id
            if (response.data.role === 'Coordinator') {
                console.log('Coordinator ID:', response.data.coordinator.coordinator_id);
                // Here you can store the coordinator_id in local storage or context
                navigate('/coordinator-dashboard'); // Redirect to coordinator dashboard
            } else {
                setMessage(`Login successful as ${response.data.role}`);
                navigate('/coordinator-dashboard'); // Redirect to coordinator dashboard for other roles
            }
        } catch (error) {
            setMessage(error.response?.data.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Coordinator Login</h2>
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

export default CoordinatorLogin;