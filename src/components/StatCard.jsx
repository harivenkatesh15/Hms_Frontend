import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, gradient, textColor = 'white' }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: gradient, // Use gradient background
        color: textColor,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)', // Move up slightly on hover
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)', // Add shadow on hover
        },
      }}
    >
      <Box sx={{ zIndex: 1 }}>
        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
          {value}
        </Typography>
      </Box>

      {/* Giant faded icon in the background for decoration */}
      <Box
        sx={{
          position: 'absolute',
          right: -20,
          bottom: -20,
          opacity: 0.2,
          fontSize: '10rem',
          transform: 'rotate(-20deg)',
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
};

export default StatCard;