import api from './axiosConfig';

// Coincide con AuthController real de LaTiendaAPI:
//   POST /api/Auth/login      body: { email, password }
//                             devuelve LoginResponseDto: { token, nombre, roles: string[] }
//                             (sin objeto "usuario" anidado, sin email en la respuesta)
//   POST /api/Auth/Registrar  body: { tipoDoc, nroDoc, nombre, email, password, roles: number[] }
//                             "roles" es obligatorio: lista de IDs (RolId) a asignar al usuario nuevo.
const authService = {
  login: async (credentials) => {
    // credentials: { email, password }
    const { data } = await api.post('/Auth/login', credentials);
    return data; // { token, nombre, roles }
  },

  register: async (nuevoUsuario) => {
    // nuevoUsuario: { tipoDoc, nroDoc, nombre, email, password, roles: number[] }
    const { data } = await api.post('/Auth/Registrar', nuevoUsuario);
    return data; // { msj: "Usuario registrado correctamente" }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },
};

export default authService;
