import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Common/PrivateRoute';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductosPage from './pages/ProductosPage';
import CategoriasPage from './pages/CategoriasPage';


export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          
        </Route>

        <Route path="/" element={<Navigate to="/productos" replace />} />
        <Route path="*" element={<Navigate to="/productos" replace />} />
      </Routes>
    </AuthProvider>
  );
}
