import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import MedicationIcon from '@mui/icons-material/Medication';

const PrescriptionList = ({ meds }) => {
    if (!meds.length) return <Typography color="text.secondary">No active prescriptions.</Typography>;

    return (
        <Box>
            {meds.map((med, i) => (
                <Paper key={i} elevation={0} sx={{ 
                    p: 2, mb: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2,
                    border: '1px solid #eee', bgcolor: '#fafafa'
                }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#e3f2fd', color: '#1976d2' }}>
                        <MedicationIcon />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography fontWeight="bold">{med.medicineName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                            {med.dosage} • {med.frequency}
                        </Typography>
                    </Box>
                    <Chip 
                        label={med.active ? "Active" : "Done"} 
                        size="small" 
                        color={med.active ? "primary" : "default"} 
                        variant={med.active ? "filled" : "outlined"}
                    />
                </Paper>
            ))}
        </Box>
    );
};
export default PrescriptionList;