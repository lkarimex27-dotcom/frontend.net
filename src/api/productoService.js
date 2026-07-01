import api from './axiosConfig';

// Coincide con ProductoController real:
//   GET    /api/Producto/Lista
//   GET    /api/Producto/Obtener/{idProducto}
//   POST   /api/Producto/Guardar
//   PUT    /api/Producto/Editar/{idProducto}
//   DELETE /api/Producto/Eliminar/{idProducto}
// Todas las respuestas exitosas vienen envueltas como { msj: "ok", response: ... },
// por eso cada método desempaqueta "response" antes de devolver el dato a la UI.
const productoService = {
  getAll: async () => {
    const { data } = await api.get('/Producto/Lista');
    return data.response; // ProductoDto[]
  },
  getById: async (idProducto) => {
    const { data } = await api.get(`/Producto/Obtener/${idProducto}`);
    return data.response; // ProductoDto
  },
  create: async (producto) => {
    // producto: { nombre, precio, stock, idCategoria, estado } (ProductoCreateDto)
    const { data } = await api.post('/Producto/Guardar', producto);
    return data.response; // ProductoDto creado
  },
  update: async (idProducto, producto) => {
    // El controlador solo responde { msj: "ok" }, sin el objeto actualizado
    const { data } = await api.put(`/Producto/Editar/${idProducto}`, producto);
    return data;
  },
  remove: async (idProducto) => {
    const { data } = await api.delete(`/Producto/Eliminar/${idProducto}`);
    return data;
  },
};

export default productoService;
