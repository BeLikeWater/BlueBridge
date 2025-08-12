import React from 'react';
import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

interface HeaderProps {
  currentUser: { name: string } | null;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1565C0', mb: 3 }}>
      <Toolbar>
        <SchoolIcon sx={{ mr: 2, color: 'white', fontSize: 32 }} />
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold', 
            color: 'white',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
          }}
        >
          Mavi Köprü
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Otizm Çocuk Takip Sistemi
          </Typography>
          {currentUser && (
            <Chip 
              label={currentUser.name}
              variant="outlined"
              sx={{ 
                color: 'white', 
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;