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
  TextField,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import productoService from '../api/productoService';
import categoriaService from '../api/categoriaService';
import ProductoForm from '../components/Productos/ProductoForm';
import ConfirmDialog from '../components/Common/ConfirmDialog';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [formAbierto, setFormAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [productoEliminar, setProductoEliminar] = useState(null);
  const [aviso, setAviso] = useState({ open: false, mensaje: '', tipo: 'success' });

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [prods, cats] = await Promise.all([productoService.getAll(), categoriaService.getAll()]);
      setProductos(prods);
      setCategorias(cats);
    } catch {
      setAviso({ open: true, mensaje: 'No se pudieron cargar los productos.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const nombreCategoria = (idCategoria) =>
    categorias.find((c) => c.idCategoria === idCategoria)?.nombre || '—';

  const handleGuardar = async (datos) => {
    try {
      if (productoEditar) {
        await productoService.update(productoEditar.idProducto, datos);
        setAviso({ open: true, mensaje: 'Producto actualizado.', tipo: 'success' });
      } else {
        await productoService.create(datos);
        setAviso({ open: true, mensaje: 'Producto creado.', tipo: 'success' });
      }
      setFormAbierto(false);
      setProductoEditar(null);
      cargarDatos();
    } catch {
      setAviso({ open: true, mensaje: 'No se pudo guardar el producto.', tipo: 'error' });
    }
  };

  const handleEliminar = async () => {
    try {
      await productoService.remove(productoEliminar.idProducto);
      setAviso({ open: true, mensaje: 'Producto eliminado.', tipo: 'success' });
      setProductoEliminar(null);
      cargarDatos();
    } catch {
      setAviso({ open: true, mensaje: 'No se pudo eliminar el producto.', tipo: 'error' });
    }
  };

  const productosFiltrados = productos.filter((p) => p.nombre?.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4">Productos</Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona el catálogo de LaTienda.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setProductoEditar(null);
            setFormAbierto(true);
          }}
        >
          Nuevo producto
        </Button>
      </Box>

      <TextField
        placeholder="Buscar producto..."
        size="small"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        sx={{ mb: 2, width: 320, bgcolor: 'background.paper' }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
      />

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : productosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">No hay productos para mostrar.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              productosFiltrados.map((p) => (
                <TableRow key={p.idProducto} hover>
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>{p.categoriaNombre || '—'}</TableCell>
                  <TableCell align="right">${Number(p.precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell align="right">{p.stock}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={p.estado ? 'Activo' : 'Inactivo'}
                      size="small"
                      color={p.estado ? 'success' : 'default'}
                      variant={p.estado ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setProductoEditar(p);
                        setFormAbierto(true);
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setProductoEliminar(p)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductoForm
        open={formAbierto}
        producto={productoEditar}
        categorias={categorias}
        onClose={() => {
          setFormAbierto(false);
          setProductoEditar(null);
        }}
        onSave={handleGuardar}
      />

      <ConfirmDialog
        open={!!productoEliminar}
        title="Eliminar producto"
        message={`¿Seguro que deseas eliminar "${productoEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onCancel={() => setProductoEliminar(null)}
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
