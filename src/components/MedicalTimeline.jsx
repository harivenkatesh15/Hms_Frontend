import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import WarningIcon from '@mui/icons-material/Warning';

const MedicalTimeline = ({ events }) => {
    if (!events.length) return <Typography color="text.secondary">No history recorded.</Typography>;

    return (
        <Box sx={{ position: 'relative', pl: 2 }}>
            {/* The Vertical Line */}
            <Box sx={{ position: 'absolute', left: 29, top: 10, bottom: 10, width: 2, bgcolor: '#e0e0e0' }} />

            {events.map((event, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 4, position: 'relative' }}>
                    {/* Icon Bubble */}
                    <Avatar sx={{ 
                        width: 40, height: 40, mr: 3, zIndex: 1,
                        bgcolor: event.eventType === 'Surgery' ? '#ff6b6b' : event.eventType === 'Allergy' ? '#feca57' : '#54a0ff'
                    }}>
                        {event.eventType === 'Surgery' ? <LocalHospitalIcon fontSize="small" /> : event.eventType === 'Allergy' ? <WarningIcon fontSize="small" /> : <HealingIcon fontSize="small" />}
                    </Avatar>
                    
                    {/* Content */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            {event.eventDate} • {event.doctorName}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                            {event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {event.description}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};
export default MedicalTimeline;