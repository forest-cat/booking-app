import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
              <Toolbar>
                <Button
                  component={Link}
                  to="/"
                  color="inherit"
                  sx={{ mr: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
                >
                  Ferry Booking
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button component={Link} to="/" color="inherit">
                  Home
                </Button>
                <Button component={Link} to="/dashboard" color="inherit">
                  Dashboard
                </Button>
              </Toolbar>
            </AppBar>
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
