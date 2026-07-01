import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/apiError';


const tiposDoc = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'TI', label: 'Tarjeta de identidad' },
];

const vacio = { nombre: '', email: '', password: '', tipoDoc: 'CC', nroDoc: '' };

export default function RegisterPage() {
  const [form, setForm] = useState(vacio);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setCargando(true);
    try {
      await register(form);
      setExito(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo completar el registro.'));
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
        py: 4,
      }}
    >
      <Paper elevation={0} sx={{ p: 5, width: 440, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h4" sx={{ mb: 0.5, color: 'primary.main' }}>
          Crear cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Regístrate para acceder al panel de LaTienda.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {exito && <Alert severity="success" sx={{ mb: 2 }}>Cuenta creada. Redirigiendo a inicio de sesión...</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Nombre completo" fullWidth required margin="normal" value={form.nombre} onChange={handleChange('nombre')} />
          <TextField label="Correo electrónico" type="email" fullWidth required margin="normal" value={form.email} onChange={handleChange('email')} />
          <TextField label="Contraseña" type="password" fullWidth required margin="normal" value={form.password} onChange={handleChange('password')} />
          <TextField select label="Tipo de documento" fullWidth required margin="normal" value={form.tipoDoc} onChange={handleChange('tipoDoc')}>
            {tiposDoc.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </TextField>
          <TextField label="Número de documento" fullWidth required margin="normal" value={form.nroDoc} onChange={handleChange('nroDoc')} />


          <Button type="submit" fullWidth variant="contained" size="large" disabled={cargando} sx={{ mt: 2, mb: 2 }}>
            {cargando ? 'Creando cuenta...' : 'Registrarme'}
          </Button>
          <Typography variant="body2" align="center">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login" color="secondary">
              Inicia sesión
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
