import React, { useState } from 'react';
import { Container, Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Students from './pages/Students';
import Programs from './pages/Programs';
import Methods from './pages/Methods';
import DailyEntries from './pages/DailyEntries';
import { PageType } from './types';
import { mockTeacher } from './data/mockData';
import './utils/manualUpload'; // Make upload function available globally

// Mavi Köprü teması
const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    secondary: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

// Basit sayfalar (henüz implementasyon yapılmadı)
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <Box sx={{ textAlign: 'center', py: 8 }}>
    <h2>🚧 {title} Sayfası</h2>
    <p>Bu sayfa henüz geliştirilme aşamasında...</p>
  </Box>
);

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');


  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'progress':
        return <Progress />;
      case 'students':
        return <Students />;
      case 'programs':
        return <Programs />;
      case 'methods':
        return <Methods />;
      case 'entries':
        return <DailyEntries />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Header currentUser={mockTeacher} />
        
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', gap: 3, py: 3 }}>
            {/* Sol Navigasyon */}
            <Navigation 
              currentPage={currentPage} 
              onPageChange={setCurrentPage} 
            />
            
            {/* Ana İçerik */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {renderPage()}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;