import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import categoriaService from '../api/categoriaService';
import CategoriaForm from '../components/Categorias/CategoriaForm';
import ConfirmDialog from '../components/Common/ConfirmDialog';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formAbierto, setFormAbierto] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [categoriaEliminar, setCategoriaEliminar] = useState(null);
  const [aviso, setAviso] = useState({
    open: false,
    mensaje: '',
    tipo: 'success',
  });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      setCategorias(await categoriaService.getAll());
    } catch {
      setAviso({
        open: true,
        mensaje: 'No se pudieron cargar las categorías.',
        tipo: 'error',
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleGuardar = async (datos) => {
    // Validar nombre repetido sin importar mayúsculas o minúsculas
    const nombreNuevaCategoria = datos.nombre.trim().toLowerCase();

    const existe = categorias.some((c) => {
      // Si se está editando, ignorar la misma categoría
      if (
        categoriaEditar &&
        c.idCategoria === categoriaEditar.idCategoria
      ) {
        return false;
      }

      return c.nombre.trim().toLowerCase() === nombreNuevaCategoria;
    });

    if (existe) {
      setAviso({
        open: true,
        mensaje: 'Ya existe una categoría con ese nombre.',
        tipo: 'error',
      });
      return;
    }

    try {
      if (categoriaEditar) {
        await categoriaService.update(
          categoriaEditar.idCategoria,
          datos
        );

        setAviso({
          open: true,
          mensaje: 'Categoría actualizada.',
          tipo: 'success',
        });
      } else {
        await categoriaService.create(datos);

        setAviso({
          open: true,
          mensaje: 'Categoría creada.',
          tipo: 'success',
        });
      }

      setFormAbierto(false);
      setCategoriaEditar(null);
      cargarDatos();
    } catch {
      setAviso({
        open: true,
        mensaje: 'No se pudo guardar la categoría.',
        tipo: 'error',
      });
    }
  };

  const handleEliminar = async () => {
    try {
      await categoriaService.remove(categoriaEliminar.idCategoria);

      setAviso({
        open: true,
        mensaje: 'Categoría eliminada.',
        tipo: 'success',
      });

      setCategoriaEliminar(null);
      cargarDatos();
    } catch {
      setAviso({
        open: true,
        mensaje: 'No se pudo eliminar la categoría.',
        tipo: 'error',
      });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4">Categorías</Typography>

          <Typography variant="body2" color="text.secondary">
            Organiza los productos por categoría.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setCategoriaEditar(null);
            setFormAbierto(true);
          }}
        >
          Nueva categoría
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ py: 5 }}
                >
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : categorias.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="center"
                  sx={{ py: 5 }}
                >
                  <Typography color="text.secondary">
                    No hay categorías para mostrar.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              categorias.map((c) => (
                <TableRow key={c.idCategoria} hover>
                  <TableCell>{c.nombre}</TableCell>

                  <TableCell align="center">
                    <Chip
                      label={c.estado ? 'Activa' : 'Inactiva'}
                      size="small"
                      color={c.estado ? 'success' : 'default'}
                      variant={
                        c.estado ? 'filled' : 'outlined'
                      }
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCategoriaEditar(c);
                        setFormAbierto(true);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() =>
                        setCategoriaEliminar(c)
                      }
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoriaForm
        open={formAbierto}
        categoria={categoriaEditar}
        onClose={() => {
          setFormAbierto(false);
          setCategoriaEditar(null);
        }}
        onSave={handleGuardar}
      />

      <ConfirmDialog
        open={!!categoriaEliminar}
        title="Eliminar categoría"
        message={`¿Seguro que deseas eliminar "${categoriaEliminar?.nombre}"? Los productos asociados podrían verse afectados.`}
        onCancel={() => setCategoriaEliminar(null)}
        onConfirm={handleEliminar}
      />

      <Snackbar
        open={aviso.open}
        autoHideDuration={3500}
        onClose={() =>
          setAviso({ ...aviso, open: false })
        }
      >
        <Alert
          severity={aviso.tipo}
          variant="filled"
          onClose={() =>
            setAviso({ ...aviso, open: false })
          }
        >
          {aviso.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}