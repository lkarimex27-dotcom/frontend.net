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

const vacio = { nombre: '', precio: '', stock: '', idCategoria: '', estado: true };

export default function ProductoForm({ open, onClose, onSave, producto, categorias }) {
  const [form, setForm] = useState(vacio);

  useEffect(() => {
    setForm(
      producto
        ? {
            nombre: producto.nombre ?? '',
            precio: producto.precio ?? '',
            stock: producto.stock ?? '',
            idCategoria: producto.idCategoria ?? '',
            estado: producto.estado ?? true,
          }
        : vacio
    );
  }, [producto, open]);

  const handleChange = (campo) => (e) => {
    const valor = campo === 'estado' ? e.target.checked : e.target.value;
    setForm({ ...form, [campo]: valor });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock, 10),
      idCategoria: parseInt(form.idCategoria, 10),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{producto ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
      <Box component="form" id="producto-form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Nombre" required value={form.nombre} onChange={handleChange('nombre')} autoFocus />
            <TextField
              label="Precio"
              type="number"
              required
              inputProps={{ step: '0.01', min: 0 }}
              value={form.precio}
              onChange={handleChange('precio')}
            />
            <TextField
              label="Stock"
              type="number"
              required
              inputProps={{ min: 0 }}
              value={form.stock}
              onChange={handleChange('stock')}
            />
            <TextField select label="Categoría" required value={form.idCategoria} onChange={handleChange('idCategoria')}>
              {categorias.map((c) => (
                <MenuItem key={c.idCategoria} value={c.idCategoria}>
                  {c.nombre}
                </MenuItem>
              ))}
            </TextField>
            <FormControlLabel
              control={<Switch checked={!!form.estado} onChange={handleChange('estado')} color="primary" />}
              label="Producto activo"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

