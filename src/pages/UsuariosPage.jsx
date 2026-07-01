import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import usuarioService from '../api/usuarioService';
import ConfirmDialog from '../components/Common/ConfirmDialog';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [aviso, setAviso] = useState({ open: false, mensaje: '', tipo: 'success' });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      setUsuarios(await usuarioService.getAll());
    } catch {
      setAviso({ open: true, mensaje: 'No se pudieron cargar los usuarios.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleEliminar = async () => {
    try {
      await usuarioService.remove(usuarioEliminar.usuarioId);
      setAviso({ open: true, mensaje: 'Usuario eliminado.', tipo: 'success' });
      setUsuarioEliminar(null);
      cargarDatos();
    } catch {
      setAviso({ open: true, mensaje: 'No se pudo eliminar el usuario.', tipo: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Usuarios</Typography>
        <Typography variant="body2" color="text.secondary">
          Los usuarios se crean desde la pantalla de registro. Aquí puedes consultarlos o eliminarlos.
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Tipo doc.</TableCell>
              <TableCell>N° documento</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : usuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No hay usuarios registrados.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              usuarios.map((u) => (
                <TableRow key={u.usuarioId} hover>
                  <TableCell>{u.nombre}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip label={u.tipoDoc} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{u.nroDoc}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="error" onClick={() => setUsuarioEliminar(u)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={!!usuarioEliminar}
        title="Eliminar usuario"
        message={`¿Seguro que deseas eliminar a "${usuarioEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onCancel={() => setUsuarioEliminar(null)}
        onConfirm={handleEliminar}
      />

      <Snackbar open={aviso.open} autoHideDuration={3500} onClose={() => setAviso({ ...aviso, open: false })}>
        <Alert severity={aviso.tipo} variant="filled" onClose={() => setAviso({ ...aviso, open: false })}>
          {aviso.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}
