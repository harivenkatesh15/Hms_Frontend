import React from 'react';
import { Grid, Paper, Typography, Box, Button } from '@mui/material';
import { 
    SmokingRooms, SportsBar, Restaurant, 
    DirectionsRun, Bed, Edit 
} from '@mui/icons-material';

// Helper Component for the individual cards
const LifestyleItem = ({ icon, title, value, color }) => (
    <Paper elevation={0} sx={{ 
        p: 3, 
        bgcolor: '#f8fafc', 
        borderRadius: 3, 
        border: '1px solid #e2e8f0', 
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: color }}>
            {icon}
            <Typography fontWeight="bold" sx={{ ml: 1 }}>{title}</Typography>
        </Box>
        <Typography variant="h6" fontWeight="800" color="text.primary">
            {value || 'Not Recorded'}
        </Typography>
    </Paper>
);

const TabLifestyle = ({ lifestyle, onEdit }) => {
    return (
        <Paper sx={{ p: 4, borderRadius: 3, minHeight: 400 }}>
            {/* Header with Edit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                    Lifestyle & Habits
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<Edit />} 
                    onClick={onEdit}
                >
                    Update Habits
                </Button>
            </Box>

            {/* Grid of Lifestyle Items */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <LifestyleItem 
                        icon={<SmokingRooms />} 
                        title="Smoking Status" 
                        value={lifestyle?.smokingStatus} 
                        color="#ef4444" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <LifestyleItem 
                        icon={<SportsBar />} 
                        title="Alcohol Consumption" 
                        value={lifestyle?.alcoholConsumption} 
                        color="#f59e0b" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <LifestyleItem 
                        icon={<Restaurant />} 
                        title="Dietary Preference" 
                        value={lifestyle?.diet} 
                        color="#10b981" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <LifestyleItem 
                        icon={<DirectionsRun />} 
                        title="Exercise Frequency" 
                        value={lifestyle?.exerciseFrequency} 
                        color="#3b82f6" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <LifestyleItem 
                        icon={<Bed />} 
                        title="Sleep Patterns" 
                        value={lifestyle?.sleepHours ? `${lifestyle.sleepHours} Hours / Night` : null} 
                        color="#6366f1" 
                    />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default TabLifestyle;