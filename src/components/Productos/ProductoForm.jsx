import { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';

const vacio = {
  nombre: '',
  precio: '',
  stock: '',
  idCategoria: '',
  estado: true,
};

export default function ProductoForm({
  open,
  onClose,
  onSave,
  producto,
  categorias,
}) {
  const [form, setForm] = useState(vacio);

  useEffect(() => {
    if (producto) {
      // Buscar el ID de la categoría usando el nombre que devuelve la API
      const categoria = categorias.find(
        (c) => c.nombre === producto.categoriaNombre
      );

      setForm({
        nombre: producto.nombre ?? '',
        precio: producto.precio ?? '',
        stock: producto.stock ?? '',
        idCategoria: categoria?.idCategoria ?? '',
        estado: producto.estado ?? true,
      });
    } else {
      setForm(vacio);
    }
  }, [producto, open, categorias]);

  const handleChange = (campo) => (e) => {
    const valor = campo === 'estado'
      ? e.target.checked
      : e.target.value;

    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      nombre: form.nombre,
      precio: Number(form.precio),
      stock: Number(form.stock),
      idCategoria: Number(form.idCategoria),
      estado: form.estado,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {producto ? 'Editar producto' : 'Nuevo producto'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Nombre"
              required
              fullWidth
              value={form.nombre}
              onChange={handleChange('nombre')}
            />

            <TextField
              label="Precio"
              type="number"
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              value={form.precio}
              onChange={handleChange('precio')}
            />

            <TextField
              label="Stock"
              type="number"
              required
              fullWidth
              inputProps={{ min: 0 }}
              value={form.stock}
              onChange={handleChange('stock')}
            />

            <TextField
              select
              label="Categoría"
              required
              fullWidth
              value={form.idCategoria || ''}
              onChange={handleChange('idCategoria')}
            >
              {categorias.map((c) => (
                <MenuItem
                  key={c.idCategoria}
                  value={c.idCategoria}
                >
                  {c.nombre}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={!!form.estado}
                  onChange={handleChange('estado')}
                />
              }
              label="Producto activo"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
          >
            Guardar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}