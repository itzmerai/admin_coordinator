import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Program {
    program_id: number;
    program_name: string;
    program_description: string;
    admin_id: number; // Include admin_id if needed
}

interface ProgramManagementProps {
    adminId: number | null; // Expecting adminId to be passed as a prop
}

const ProgramManagement: React.FC<ProgramManagementProps> = ({ adminId }) => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [programName, setProgramName] = useState('');
    const [programDescription, setProgramDescription] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch programs on component mount
    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/programs'); // Adjust the endpoint if needed
                setPrograms(response.data);
            } catch (error) {
                console.error('Error fetching programs:', error);
                setMessage('Error fetching programs');
            }
        };

        fetchPrograms();
    }, []);

    const handleAddProgram = async (e: React.FormEvent) => {
        e.preventDefault();

        if (adminId === null) {
            setMessage('Admin ID is required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/programs/add', {
                admin_id: adminId,
                program_name: programName,
                program_description: programDescription
            });

            // Reset form fields after successful addition
            setProgramName('');
            setProgramDescription('');
            setMessage(response.data.message); // Set success message

            // Re-fetch the programs to update the table
            const updatedResponse = await axios.get('http://localhost:5000/api/programs');
            setPrograms(updatedResponse.data);
        } catch (error) {
            setMessage('Error adding program: ' + (error.response?.data.message || 'An error occurred'));
        }
    };

    return (
        <div>
            <h2>Program Management</h2>
            <form onSubmit={handleAddProgram}>
                <label htmlFor="program_name">Program Name</label>
                <input
                    type="text"
                    id="program_name" // Add a unique id attribute
                    placeholder="Program Name"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    required
                />
                <label htmlFor="program_description">Program Description</label>
                <input
                    type="text"
                    id="program_description" // Add a unique id attribute
                    placeholder="Program Description"
                    value={programDescription}
                    onChange={(e) => setProgramDescription(e.target.value)}
                    required
                />
                <button type="submit">Add Program</button>
            </form>
            {message && <p>{message}</p>}

            <h3>Existing Programs</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((program) => (
                        <tr key={program.program_id}>
                            <td>{program.program_id}</td>
                            <td>{program.program_name}</td>
                            <td>{program.program_description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProgramManagement;