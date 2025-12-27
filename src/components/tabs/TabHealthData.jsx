import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { MonitorHeart, Compress, Thermostat, Air, Add } from '@mui/icons-material';
import VitalCard from '../../components/VitalCard';

const TabHealthData = ({ vitals, history, onAdd }) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">Latest Vitals</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={onAdd}>Record Vitals</Button>
            </Box>
            
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <VitalCard title="Heart Rate" value={`${vitals?.heartRate || '--'} bpm`} icon={<MonitorHeart />} color="#ff6b6b" data={history?.map(h => ({ v: h.heartRate }))} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <VitalCard title="Blood Pressure" value={vitals?.bloodPressure || '--'} icon={<Compress />} color="#54a0ff" data={null} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <VitalCard title="Temperature" value={`${vitals?.temperature || '--'} °F`} icon={<Thermostat />} color="#feca57" data={history?.map(h => ({ v: h.temperature }))} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <VitalCard title="Oxygen (SpO2)" value={`${vitals?.oxygenLevel || '--'} %`} icon={<Air />} color="#1dd1a1" data={history?.map(h => ({ v: h.oxygenLevel }))} />
                </Grid>
            </Grid>
        </Box>
    );
};
export default TabHealthData;