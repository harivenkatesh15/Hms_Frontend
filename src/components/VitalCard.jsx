import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const VitalCard = ({ title, value, icon, color, data }) => {
    return (
        <Paper elevation={0} sx={{ 
            p: 3, borderRadius: 4, height: 160, position: 'relative', overflow: 'hidden',
            background: `linear-gradient(135deg, white 0%, ${color}15 100%)`, // Subtle gradient
            border: `1px solid ${color}30`,
            transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)' }
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: `${color}20`, color: color }}>
                    {icon}
                </Box>
                {/* Mini Graph in Background */}
                {data && (
                    <Box sx={{ width: 80, height: 40 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight="600">{title}</Typography>
            <Typography variant="h4" fontWeight="800" sx={{ mt: 1, color: '#2d3436' }}>
                {value}
            </Typography>
        </Paper>
    );
};
export default VitalCard;