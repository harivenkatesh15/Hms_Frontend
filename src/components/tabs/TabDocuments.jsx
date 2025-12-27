import React from 'react';
import { Box, Typography, Paper, Chip, Avatar, Button } from '@mui/material';
import { FolderOpen, PictureAsPdf, UploadFile } from '@mui/icons-material';

const TabDocuments = ({ reports, onAdd }) => {
    return (
        <Paper sx={{ 
            p: 4, borderRadius: 3, 
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
            color: 'white', minHeight: 400 
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}><FolderOpen /></Avatar>
                    <Typography variant="h5" fontWeight="bold">Digital Health Vault</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<UploadFile />} 
                    onClick={onAdd}
                    sx={{ bgcolor: 'white', color: '#11998e', '&:hover': { bgcolor: '#f0f0f0' } }}
                >
                    Upload Report
                </Button>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
                {reports?.length > 0 ? (
                    reports.map((rep) => (
                        <Box key={rep.id} sx={{ 
                            display: 'flex', alignItems: 'center', p: 2, 
                            bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: 3,
                            color: '#1e293b', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' }
                        }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f1f5f9', color: '#ef4444', mr: 2 }}><PictureAsPdf /></Box>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography fontWeight="bold">{rep.testName}</Typography>
                                <Typography variant="caption" color="text.secondary">{rep.testDate}</Typography>
                            </Box>
                            <Chip label={rep.resultSummary} size="small" color={rep.resultSummary === 'Normal' ? 'success' : 'warning'} />
                        </Box>
                    ))
                ) : <Typography sx={{ opacity: 0.8 }}>No documents found.</Typography>}
            </Box>
        </Paper>
    );
};
export default TabDocuments;