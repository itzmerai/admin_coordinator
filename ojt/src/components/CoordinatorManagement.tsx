import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Coordinator {
    coordinator_id: number;
    coordinator_name: string;
    coordinator_schoolId: string;
    coordinator_user: string;
    coordinator_status: string;
}

interface CoordinatorManagementProps {
    adminId: number | null;
}

const CoordinatorManagement: React.FC<CoordinatorManagementProps> = ({ adminId }) => {
    const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
    const [coordinatorName, setCoordinatorName] = useState('');
    const [coordinatorSchoolId, setCoordinatorSchoolId] = useState('');
    const [coordinatorUser, setCoordinatorUser] = useState('');
    const [coordinatorPassword, setCoordinatorPassword] = useState('');
    const [coordinatorStatus, setCoordinatorStatus] = useState('active'); // default status
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch coordinators on component mount
    useEffect(() => {
        const fetchCoordinators = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/coordinator');
                setCoordinators(response.data);
            } catch (error) {
                console.error('Error fetching coordinators:', error);
                setMessage('Error fetching coordinators');
            }
        };

        fetchCoordinators();
    }, []);

    const handleAddCoordinator = async (e: React.FormEvent) => {
        e.preventDefault();

        if (adminId === null) {
            setMessage('Admin ID is required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/coordinator/add', {
                admin_id: adminId,
                coordinator_name: coordinatorName,
                coordinator_schoolId: coordinatorSchoolId,
                coordinator_user: coordinatorUser,
                coordinator_password: coordinatorPassword,
                coordinator_status: coordinatorStatus
            });

            // Reset form fields after successful addition
            setCoordinatorName('');
            setCoordinatorSchoolId('');
            setCoordinatorUser('');
            setCoordinatorPassword('');
            setCoordinatorStatus('active');
            setMessage(response.data.message); // Set success message

            // Re-fetch the coordinators to update the table
            const updatedResponse = await axios.get('http://localhost:5000/api/coordinator');
            setCoordinators(updatedResponse.data);

            // Redirect to dashboard after successful addition
            navigate('/dashboard');
        } catch (error) {
            setMessage('Error adding coordinator: ' + (error.response?.data.message || 'An error occurred'));
        }
    };

    return (
        <div>
            <h2>Coordinator Management</h2>
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
            {message && <p>{message}</p>}

            <h3>Existing Coordinators</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>School ID</th>
                        <th>Username</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {coordinators.map((coordinator) => (
                        <tr key={coordinator.coordinator_id}>
                            <td>{coordinator.coordinator_id}</td>
                            <td>{coordinator.coordinator_name}</td>
                            <td>{coordinator.coordinator_schoolId}</td>
                            <td>{coordinator.coordinator_user}</td>
                            <td>{coordinator.coordinator_status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoordinatorManagement;