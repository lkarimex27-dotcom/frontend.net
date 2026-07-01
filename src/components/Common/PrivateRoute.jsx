import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
