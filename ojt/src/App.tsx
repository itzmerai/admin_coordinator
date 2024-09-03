import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import AddCompany from './components/AddCompany';
import Dashboard from './components/Dashboard';
import CoordinatorManagement from './components/CoordinatorManagement';
import ProgramManagement from './components/ProgramManagement';
import SchoolYearManagement from './components/SchoolYearManagement';

const App: React.FC = () => {
    const [userId, setUserId] = useState<number | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedRole = localStorage.getItem('role');
        if (storedUserId && storedRole) {
            setUserId(parseInt(storedUserId));
            setRole(storedRole);
        }
    }, []);

    const handleLoginSuccess = (id: number, userRole: string) => {
        setUserId(id);
        setRole(userRole);
        localStorage.setItem('userId', id.toString());
        localStorage.setItem('role', userRole);
    };

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/coordinator-dashboard" element={role === 'Coordinator' && userId ? <CoordinatorDashboard coordinatorId={userId} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/add-company" element={role === 'Coordinator' && userId ? <AddCompany coordinatorId={userId} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/dashboard" element={role === 'Administrator' && userId ? <Dashboard userId={userId} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/coordinator-management" element={role === 'Administrator' && userId ? <CoordinatorManagement adminId={userId} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/program-management" element={role === 'Administrator' && userId ? <ProgramManagement adminId={userId} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/school-year-management" element={role === 'Administrator' && userId ? <SchoolYearManagement adminId={userId} /> : <Login onLoginSuccess={handleLoginSuccess} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
