import api from './axiosConfig';

// ⚠️ SUPOSICIÓN: no compartiste el código de un UsuarioController, así que estas rutas
// asumen el mismo patrón que ProductoController/CategoriaController
// (Lista / Editar / Eliminar, respuesta envuelta en { msj, response }).
// La creación de usuarios NO pasa por aquí: se hace vía POST /api/Auth/Registrar.
// Si tu backend no tiene un UsuarioController separado, esta pantalla mostrará
// un error al cargar (manejado con un Snackbar) hasta que lo agregues o ajustes la ruta.
const usuarioService = {
  getAll: async () => {
    const { data } = await api.get('/Usuario/Lista');
    return data.response; // Usuario[]
  },
  update: async (usuarioId, usuario) => {
    const { data } = await api.put(`/Usuario/Editar/${usuarioId}`, usuario);
    return data;
  },
  remove: async (usuarioId) => {
    const { data } = await api.delete(`/Usuario/Eliminar/${usuarioId}`);
    return data;
  },
};

export default usuarioService;
