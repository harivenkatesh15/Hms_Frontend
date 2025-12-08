import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle'; // Import Toggle

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <AppBar position="static" color="inherit" elevation={1}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
                    MedVault HMS
                </Typography>
                
                {/* Add the toggle here */}
                <ThemeToggle /> 

                {user && (
                    <Button color="inherit" onClick={() => { logout(); navigate('/login'); }} sx={{ ml: 2 }}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};
export default Navbar;