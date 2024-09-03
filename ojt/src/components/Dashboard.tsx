import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC<{ adminId: number | null }> = ({ adminId }) => {
    const navigate = useNavigate();

    const handleCoordinatorManagement = () => {
        navigate('/coordinator-management'); // Navigate to the coordinator management page
    };

    const handleProgramManagement = () => {
        navigate('/program-management'); // Navigate to the program management page
    };

    const handleSchoolYearManagement = () => {
        navigate('/school-year-management'); // Navigate to the school year management page
    };

    return (
        <div>
            <h2>Welcome to the Admin Dashboard</h2>
            <button onClick={handleCoordinatorManagement}>Manage Coordinators</button>
            <button onClick={handleProgramManagement}>Manage Programs</button>
            <button onClick={handleSchoolYearManagement}>Manage School Years</button> {/* Ensure this button is present */}
        </div>
    );
};

export default Dashboard;