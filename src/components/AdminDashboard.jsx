import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const { token } = useContext(AuthContext);
    const [msg, setMsg] = useState('');

    // Fetch Pending Doctors on Load
    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/pending-doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(res.data);
        } catch (err) {
            console.error("Failed to fetch doctors", err);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMsg('Doctor Approved!');
            fetchDoctors(); // Refresh list
        } catch (err) {
            setMsg('Approval Failed');
        }
    };

    return (
        <>
            <Navbar />
            <Container sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
                <Typography variant="h6" gutterBottom>Pending Doctor Approvals</Typography>
                
                {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {doctors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No pending approvals</TableCell>
                                </TableRow>
                            ) : (
                                doctors.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>{doc.id}</TableCell>
                                        <TableCell>{doc.fullName}</TableCell>
                                        <TableCell>{doc.email}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="success" onClick={() => handleApprove(doc.id)}>
                                                Approve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
        </>
    );
};

export default AdminDashboard;