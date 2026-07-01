import { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';

const vacio = { nombre: '', estado: true };

export default function CategoriaForm({ open, onClose, onSave, categoria }) {
  const [form, setForm] = useState(vacio);

  useEffect(() => {
    setForm(categoria ? { nombre: categoria.nombre ?? '', estado: categoria.estado ?? true } : vacio);
  }, [categoria, open]);

  const handleChange = (campo) => (e) => {
    const valor = campo === 'estado' ? e.target.checked : e.target.value;
    setForm({ ...form, [campo]: valor });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{categoria ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField label="Nombre" required value={form.nombre} onChange={handleChange('nombre')} autoFocus />
            <FormControlLabel
              control={<Switch checked={!!form.estado} onChange={handleChange('estado')} color="primary" />}
              label="Categoría activa"
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
