import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; // Use named import

interface AddCompanyProps {
    coordinatorId: number; // Pass coordinator ID as a prop
}

const AddCompany: React.FC<AddCompanyProps> = ({ coordinatorId }) => {
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [companySupervisor, setCompanySupervisor] = useState('');
    const [companySupervisorContact, setCompanySupervisorContact] = useState('');
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [message, setMessage] = useState('');

    const handleAddCompany = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/company/add', {
                coordinator_id: coordinatorId,
                company_name: companyName,
                company_address: companyAddress,
                company_supervisor: companySupervisor,
                company_supervisorContact: companySupervisorContact,
                company_qr: qrCodeValue, // Send QR code value to the backend
            });

            // Reset form fields after successful addition
            setCompanyName('');
            setCompanyAddress('');
            setCompanySupervisor('');
            setCompanySupervisorContact('');
            setQrCodeValue('');
            setMessage(response.data.message); // Set success message
        } catch (error) {
            setMessage('Error adding company: ' + (error.response?.data.message || 'An error occurred'));
        }
    };

    const generateQrCode = () => {
        const qrData = `Company: ${companyName}, Address: ${companyAddress}`; // Customize QR code data as needed
        setQrCodeValue(qrData);
    };

    return (
        <div>
            <h2>Add Company</h2>
            <form onSubmit={handleAddCompany}>
                <label htmlFor="company_name">Company Name</label>
                <input
                    type="text"
                    id="company_name"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                />
                <label htmlFor="company_address">Company Address</label>
                <input
                    type="text"
                    id="company_address"
                    placeholder="Company Address"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    required
                />
                <label htmlFor="company_supervisor">Supervisor Name</label>
                <input
                    type="text"
                    id="company_supervisor"
                    placeholder="Supervisor Name"
                    value={companySupervisor}
                    onChange={(e) => setCompanySupervisor(e.target.value)}
                    required
                />
                <label htmlFor="company_supervisorContact">Supervisor Contact</label>
                <input
                    type="text"
                    id="company_supervisorContact"
                    placeholder="Supervisor Contact"
                    value={companySupervisorContact}
                    onChange={(e) => setCompanySupervisorContact(e.target.value)}
                    required
                />
                <button type="button" onClick={generateQrCode}>Generate QR Code</button>
                <button type="submit">Add Company</button>
            </form>
            {message && <p>{message}</p>}
            {qrCodeValue && (
                <div>
                    <h3>Generated QR Code:</h3>
                    <QRCodeCanvas value={qrCodeValue} size={256} />
                </div>
            )}
        </div>
    );
};

export default AddCompany;