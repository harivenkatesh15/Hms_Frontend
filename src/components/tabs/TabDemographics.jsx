import React from 'react';
import { Paper, Typography, Grid, Divider, Box } from '@mui/material';

const InfoRow = ({ label, value }) => (
    <Grid container sx={{ py: 2 }}>
        <Grid item xs={12} sm={4}><Typography color="text.secondary" fontWeight="500">{label}</Typography></Grid>
        <Grid item xs={12} sm={8}><Typography fontWeight="600">{value || '--'}</Typography></Grid>
    </Grid>
);

const TabDemographics = ({ profile }) => {
    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'primary.main' }}>Basic Demographics</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <InfoRow label="Full Name" value={profile?.fullName} />
            <Divider component="li" sx={{ listStyle: 'none' }} />
            <InfoRow label="Date of Birth" value="2004-02-11" /> {/* Placeholder or calc from Age */}
            <Divider component="li" sx={{ listStyle: 'none' }} />
            <InfoRow label="Gender" value={profile?.gender} />
            <Divider component="li" sx={{ listStyle: 'none' }} />
            <InfoRow label="Blood Group" value={profile?.bloodGroup} />
            <Divider component="li" sx={{ listStyle: 'none' }} />
            <InfoRow label="Marital Status" value="Single" /> {/* New Field if needed */}
            <Divider component="li" sx={{ listStyle: 'none' }} />
            <InfoRow label="Phone Number" value={profile?.phoneNumber} />
            <Divider component="li" sx={{ listStyle: 'none' }} />
            <InfoRow label="Email" value={profile?.email} />
            <Divider component="li" sx={{ listStyle: 'none' }} />
            <InfoRow label="Address" value={profile?.address} />
        </Paper>
    );
};
export default TabDemographics;