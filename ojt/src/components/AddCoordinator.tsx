import React, { useState } from 'react';
import axios from 'axios';

interface AddCoordinatorProps {
    adminId: number | null; // Expect adminId to be a number or null
}

const AddCoordinator: React.FC<AddCoordinatorProps> = ({ adminId }) => {
    const [coordinatorName, setCoordinatorName] = useState('');
    const [coordinatorSchoolId, setCoordinatorSchoolId] = useState('');
    const [coordinatorUser, setCoordinatorUser] = useState('');
    const [coordinatorPassword, setCoordinatorPassword] = useState('');
    const [coordinatorStatus, setCoordinatorStatus] = useState('active'); // default status
    const [message, setMessage] = useState('');

    const handleAddCoordinator = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if adminId is null before making the request
        if (adminId === null) {
            setMessage('Admin ID is required.');
            return;
        }

        try {
            console.log('Adding coordinator with adminId:', adminId); // Log adminId before sending
            const response = await axios.post('http://localhost:5000/api/coordinator/add', {
                admin_id: adminId, // Pass the adminId here
                coordinator_name: coordinatorName,
                coordinator_schoolId: coordinatorSchoolId,
                coordinator_user: coordinatorUser,
                coordinator_password: coordinatorPassword,
                coordinator_status: coordinatorStatus
            });
            setMessage(response.data.message); // Set success message
        } catch (error) {
            setMessage('Error adding coordinator: ' + (error.response?.data.message || 'An error occurred'));
        }
    };

    return (
        <div>
            <h2>Add Coordinator</h2>
            <form onSubmit={handleAddCoordinator}>
                <input
                    type="text"
                    placeholder="Coordinator Name"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="School ID"
                    value={coordinatorSchoolId}
                    onChange={(e) => setCoordinatorSchoolId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Coordinator Username"
                    value={coordinatorUser}
                    onChange={(e) => setCoordinatorUser(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Coordinator Password"
                    value={coordinatorPassword}
                    onChange={(e) => setCoordinatorPassword(e.target.value)}
                    required
                />
                <select
                    value={coordinatorStatus}
                    onChange={(e) => setCoordinatorStatus(e.target.value)}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button type="submit">Add Coordinator</button>
            </form>
            {message && <p>{message}</p>} {/* Display message */}
        </div>
    );
};

export default AddCoordinator;