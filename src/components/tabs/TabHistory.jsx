import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import MedicalTimeline from '../../components/MedicalTimeline'; 

const TabHistory = ({ events, onAdd }) => {
    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">Medical History</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={onAdd}>Add Event</Button>
            </Box>
            <MedicalTimeline events={events || []} />
        </Paper>
    );
};
export default TabHistory;