import React from 'react';
import { 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as StudentsIcon,
  Assignment as ProgramsIcon,
  PlaylistAddCheck as MethodsIcon,
  EditNote as EntriesIcon,
  TrendingUp as ProgressIcon
} from '@mui/icons-material';
import { PageType } from '../../types';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const navigationItems = [
  { id: 'dashboard' as PageType, label: 'Ana Sayfa', icon: DashboardIcon },
  { id: 'students' as PageType, label: 'Öğrenciler', icon: StudentsIcon },
  { id: 'programs' as PageType, label: 'Programlar', icon: ProgramsIcon },
  { id: 'methods' as PageType, label: 'Yöntemler', icon: MethodsIcon },
  { id: 'entries' as PageType, label: 'Günlük Girişler', icon: EntriesIcon },
  { id: 'progress' as PageType, label: 'İlerleme Grafikleri', icon: ProgressIcon },
];

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        width: 280, 
        minHeight: '600px',
        backgroundColor: '#f8f9fa'
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: '#1565C0', fontWeight: 'bold', mb: 1 }}>
          Menü
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
          Sistemi yönetmek için aşağıdaki menülerden birini seçin
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ p: 0 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => onPageChange(item.id)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  backgroundColor: isActive ? '#1565C0' : 'transparent',
                  color: isActive ? 'white' : '#333',
                  '&:hover': {
                    backgroundColor: isActive ? '#1565C0' : 'rgba(21, 101, 192, 0.08)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'white' : '#1565C0',
                    minWidth: 40
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default Navigation;