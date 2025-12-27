import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import PrescriptionList from '../../components/PrescriptionList';

const TabMeds = ({ meds, onAdd }) => {
    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">Prescriptions</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={onAdd}>Add Meds</Button>
            </Box>
            <PrescriptionList meds={meds || []} />
        </Paper>
    );
};
export default TabMeds;