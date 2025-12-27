import React from 'react';
import { Paper, Typography, Grid, Button, Box, Divider } from '@mui/material';
import { Visibility, VerifiedUser } from '@mui/icons-material';

const TabIdentification = ({ profile }) => {
    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: 'primary.main' }}>
                Identity & Insurance
            </Typography>

            <Grid container spacing={4}>
                {/* Government ID Section */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <VerifiedUser color="primary" sx={{ mr: 1 }} />
                            <Typography fontWeight="bold">Government ID</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Typography variant="caption" color="text.secondary">ID Number</Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                            {profile?.govtIdNumber || 'Not Uploaded'}
                        </Typography>

                        {profile?.govtIdImagePath && (
                            <Button 
                                variant="outlined" 
                                startIcon={<Visibility />} 
                                size="small"
                                href={`http://localhost:8080/${profile.govtIdImagePath}`} // Adjust based on your file serving logic
                                target="_blank"
                            >
                                View Document
                            </Button>
                        )}
                    </Box>
                </Grid>

                {/* Insurance Section (Placeholder for future update) */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3, border: '1px dashed #bdbdbd', borderRadius: 2, height: '100%' }}>
                        <Typography fontWeight="bold" color="text.secondary">Primary Insurance</Typography>
                        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', color: '#e65100', borderRadius: 1 }}>
                            <Typography variant="body2" fontWeight="bold">No Active Policy Linked</Typography>
                        </Box>
                        <Button size="small" sx={{ mt: 2 }}>+ Add Insurance Details</Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};
export default TabIdentification;