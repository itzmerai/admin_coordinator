import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Use named import

interface Company {
    company_id: number;
    company_name: string;
    company_address: string;
    company_supervisor: string;
    company_supervisorContact: string;
    company_qr: string;
    company_status: string;
}

const CoordinatorDashboard: React.FC<{ coordinatorId: number }> = ({ coordinatorId }) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/companies/${coordinatorId}`);
                setCompanies(response.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, [coordinatorId]);

    const handleAddCompany = () => {
        navigate('/add-company', { state: { coordinatorId } });
    };

    return (
        <div>
            <h2>Coordinator Dashboard</h2>
            <p>Welcome to the Coordinator Dashboard!</p>
            <button onClick={handleAddCompany}>Add Company</button>

            <h3>Added Companies</h3>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Supervisor</th>
                        <th>Supervisor Contact</th>
                        <th>QR Code</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map((company) => (
                        <tr key={company.company_id}>
                            <td>{company.company_id}</td>
                            <td>{company.company_name}</td>
                            <td>{company.company_address}</td>
                            <td>{company.company_supervisor}</td>
                            <td>{company.company_supervisorContact}</td>
                            <td>
                                <QRCodeCanvas value={company.company_qr} size={128} />
                            </td>
                            <td>{company.company_status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoordinatorDashboard;