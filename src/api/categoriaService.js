import api from './axiosConfig';

// Coincide con CategoriaController real:
//   GET    /api/Categoria/Lista
//   POST   /api/Categoria/Guardar       body: { nombre, estado }
//   PUT    /api/Categoria/Editar/{idCategoria}  body: { nombre, estado }
//   DELETE /api/Categoria/Eliminar/{idCategoria}
// Nota: este controlador NO expone un endpoint "Obtener/{id}" individual,
// por eso no hay método getById aquí (la edición usa el registro ya cargado en la tabla).
// Las respuestas exitosas vienen envueltas como { msj: "ok", response: ... }.
const categoriaService = {
  getAll: async () => {
    const { data } = await api.get('/Categoria/Lista');
    return data.response; // Categoria[]
  },
  create: async (categoria) => {
    // categoria: { nombre, estado }
    const { data } = await api.post('/Categoria/Guardar', categoria);
    return data.response; // Categoria creada (incluye idCategoria)
  },
  update: async (idCategoria, categoria) => {
    const { data } = await api.put(`/Categoria/Editar/${idCategoria}`, categoria);
    return data; // { msj: "ok" }
  },
  remove: async (idCategoria) => {
    const { data } = await api.delete(`/Categoria/Eliminar/${idCategoria}`);
    return data; // { msj: "ok" }
  },
};

export default categoriaService;
