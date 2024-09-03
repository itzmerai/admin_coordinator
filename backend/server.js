const express = require('express');
const mysql = require('mysql');
const cors = require('cors');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: '', // replace with your MySQL password
    database: 'ojtms' // replace with your database name
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// POST Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Check Administrator
    const adminQuery = 'SELECT * FROM Administrator WHERE admin_user = ? AND admin_password = ?';
    db.query(adminQuery, [username, password], (err, adminResults) => {
        if (err) return res.status(500).json(err);
        if (adminResults.length > 0) {
            return res.status(200).json({ role: 'Administrator', admin: adminResults[0] });
        }

        // Check Coordinator
        const coordinatorQuery = 'SELECT * FROM Coordinator WHERE coordinator_user = ? AND coordinator_password = ?';
        db.query(coordinatorQuery, [username, password], (err, coordinatorResults) => {
            if (err) return res.status(500).json(err);
            if (coordinatorResults.length > 0) {
                return res.status(200).json({ role: 'Coordinator', coordinator: coordinatorResults[0] });
            }

            // Check Student
            const studentQuery = 'SELECT * FROM Student WHERE student_schoolId = ? AND student_password = ?';
            db.query(studentQuery, [username, password], (err, studentResults) => {
                if (err) return res.status(500).json(err);
                if (studentResults.length > 0) {
                    return res.status(200).json({ role: 'Student', student: studentResults[0] });
                }

                return res.status(401).json({ message: 'Invalid credentials' });
            });
        });
    });
});

// Add Coordinator Route
app.post('/api/coordinator/add', (req, res) => {
    const { admin_id, coordinator_name, coordinator_schoolId, coordinator_user, coordinator_password, coordinator_status } = req.body;

    // Log the incoming request body
    console.log('Received request to add coordinator with data:', req.body);

    // Check if all required fields are provided
    if (!admin_id || !coordinator_name || !coordinator_schoolId || !coordinator_user || !coordinator_password || !coordinator_status) {
        console.log('Missing required fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO Coordinator (admin_id, coordinator_name, coordinator_schoolId, coordinator_user, coordinator_password, coordinator_status) VALUES (?, ?, ?, ?, ?, ?)';
    
    // Log the query and values
    console.log('Executing query:', query);
    console.log('With values:', [admin_id, coordinator_name, coordinator_schoolId, coordinator_user, coordinator_password, coordinator_status]);

    db.query(query, [admin_id, coordinator_name, coordinator_schoolId, coordinator_user, coordinator_password, coordinator_status], (err, results) => {
        if (err) {
            console.error('Error adding coordinator:', err); // Log the error
            return res.status(500).json({ message: 'Error adding coordinator' });
        }
        console.log('Coordinator added successfully with ID:', results.insertId);
        return res.status(200).json({ message: 'Coordinator added successfully', coordinatorId: results.insertId });
    });
});

// GET Coordinators Route
app.get('/api/coordinator', (req, res) => {
    const query = 'SELECT * FROM Coordinator';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching coordinators' });
        }
        return res.status(200).json(results);
    });
});

// GET Programs Route
app.get('/api/programs', (req, res) => {
    const query = 'SELECT * FROM program'; // Adjust the table name if needed
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching programs' });
        }
        return res.status(200).json(results);
    });
});

// POST Add Program Route
app.post('/api/programs/add', (req, res) => {
    const { admin_id, program_name, program_description } = req.body;

    // Check if all required fields are provided
    if (!admin_id || !program_name || !program_description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO program (admin_id, program_name, program_description) VALUES (?, ?, ?)';
    db.query(query, [admin_id, program_name, program_description], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error adding program' });
        }
        return res.status(200).json({ message: 'Program added successfully', programId: results.insertId });
    });
});

// GET School Years Route
app.get('/api/school-years', (req, res) => {
    const query = 'SELECT * FROM school_year'; // Adjust the table name if needed
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error fetching school years' });
        }
        return res.status(200).json(results);
    });
});

// POST Add School Year Route
app.post('/api/school-years/add', (req, res) => {
    const { admin_id, school_sy } = req.body;

    // Check if all required fields are provided
    if (!admin_id || !school_sy) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO school_year (admin_id, school_sy) VALUES (?, ?)';
    db.query(query, [admin_id, school_sy], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error adding school year' });
        }
        return res.status(200).json({ message: 'School year added successfully', yearId: results.insertId });
    });
});

// POST Add Company Route
app.post('/api/company/add', (req, res) => {
    const { coordinator_id, company_name, company_address, company_supervisor, company_supervisorContact, company_qr } = req.body;

    // Check if all required fields are provided
    if (!coordinator_id || !company_name || !company_address || !company_supervisor || !company_supervisorContact || !company_qr) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = 'INSERT INTO company (coordinator_id, company_name, company_address, company_supervisor, company_supervisorContact, company_qr, company_status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [coordinator_id, company_name, company_address, company_supervisor, company_supervisorContact, company_qr, 'active'], (err, results) => {
        if (err) {
            console.error('Error adding company:', err);
            return res.status(500).json({ message: 'Error adding company' });
        }
        return res.status(200).json({ message: 'Company added successfully', companyId: results.insertId });
    });
});

// GET Companies Route
app.get('/api/companies/:coordinatorId', (req, res) => {
    const coordinatorId = req.params.coordinatorId;

    const query = 'SELECT * FROM company WHERE coordinator_id = ?';
    db.query(query, [coordinatorId], (err, results) => {
        if (err) {
            console.error('Error fetching companies:', err);
            return res.status(500).json({ message: 'Error fetching companies' });
        }
        return res.status(200).json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});