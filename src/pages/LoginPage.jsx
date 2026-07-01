import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert, Link, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/apiError';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login({ email, password });
      navigate('/productos');
    } catch (err) {
      setError(extractErrorMessage(err, 'Correo o contraseña incorrectos.'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper elevation={0} sx={{ p: 5, width: 400, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h4" sx={{ mb: 0.5, color: 'primary.main' }}>
          LaTienda
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Inicia sesión para administrar el catálogo.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Contraseña"
            type={verPassword ? 'text' : 'password'}
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setVerPassword(!verPassword)} edge="end">
                    {verPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" size="large" disabled={cargando} sx={{ mt: 3, mb: 2 }}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </Button>
          <Typography variant="body2" align="center">
            ¿No tienes cuenta?{' '}
            <Link component={RouterLink} to="/register" color="secondary">
              Regístrate
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
