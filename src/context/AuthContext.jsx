import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = jwtDecode(token);
        const expirado = payload.exp * 1000 < Date.now();
        if (expirado) {
          authService.logout();
        } else {
          const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || 'null');
          // Fallback si no hay nada en localStorage: intenta leer claims comunes del JWT
          // (los nombres exactos dependen de tu JwtService, ajusta si es necesario).
          setUsuario(
            usuarioGuardado || {
              nombre: payload.name || payload.unique_name || payload.sub,
              email: payload.email,
            }
          );
        }
      } catch {
        authService.logout();
      }
    }
    setCargando(false);
  }, []);

  const login = async (credentials) => {
    // LoginResponseDto real: { token, nombre }
    const data = await authService.login(credentials);
    localStorage.setItem('token', data.token);
    const usuarioInfo = {
      nombre: data.nombre,
      email: credentials.email, // el backend no devuelve el email en el login, lo guardamos del form
    };
    localStorage.setItem('usuario', JSON.stringify(usuarioInfo));
    setUsuario(usuarioInfo);
    return data;
  };

  const register = async (nuevoUsuario) => {
    return authService.register(nuevoUsuario);
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
