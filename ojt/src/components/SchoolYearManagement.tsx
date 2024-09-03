import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SchoolYear {
    year_id: number;
    school_sy: string; // School year (e.g., "2023-2024")
    admin_id: number; // Admin ID
}

interface SchoolYearManagementProps {
    adminId: number | null; // Expecting adminId to be passed as a prop
}

const SchoolYearManagement: React.FC<SchoolYearManagementProps> = ({ adminId }) => {
    const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
    const [schoolSy, setSchoolSy] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch school years on component mount
    useEffect(() => {
        const fetchSchoolYears = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/school-years'); // Adjust the endpoint if needed
                setSchoolYears(response.data);
            } catch (error) {
                console.error('Error fetching school years:', error);
                setMessage('Error fetching school years');
            }
        };

        fetchSchoolYears();
    }, []);

    const handleAddSchoolYear = async (e: React.FormEvent) => {
        e.preventDefault();

        if (adminId === null) {
            setMessage('Admin ID is required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/school-years/add', {
                admin_id: adminId,
                school_sy: schoolSy
            });

            // Reset form field after successful addition
            setSchoolSy('');
            setMessage(response.data.message); // Set success message

            // Re-fetch the school years to update the table
            const updatedResponse = await axios.get('http://localhost:5000/api/school-years');
            setSchoolYears(updatedResponse.data);
        } catch (error) {
            setMessage('Error adding school year: ' + (error.response?.data.message || 'An error occurred'));
        }
    };

    return (
        <div>
            <h2>School Year Management</h2>
            <form onSubmit={handleAddSchoolYear}>
                <label htmlFor="school_sy">School Year</label>
                <input
                    type="text"
                    id="school_sy" // Add a unique id attribute
                    placeholder="School Year (e.g., 2023-2024)"
                    value={schoolSy}
                    onChange={(e) => setSchoolSy(e.target.value)}
                    required
                />
                <button type="submit">Add School Year</button>
            </form>
            {message && <p>{message}</p>}

            <h3>Existing School Years</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>School Year</th>
                    </tr>
                </thead>
                <tbody>
                    {schoolYears.map((year) => (
                        <tr key={year.year_id}>
                            <td>{year.year_id}</td>
                            <td>{year.school_sy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SchoolYearManagement;