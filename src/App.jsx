import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/style.css';

import Inicio from './pages/Inicio';
import Nosotros from './pages/Nosotros';
import Carta from './pages/Carta';
import Reservas from './pages/Reservas';
import Galeria from './pages/Galeria';
import Ubicacion from './pages/Ubicacion';
import Reclamaciones from './pages/Reclamaciones';
import Login from './pages/Login';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPOS from './pages/admin/AdminPOS';
import AdminMenu from './pages/admin/AdminMenu';
import AdminInventario from './pages/admin/AdminInventario';
import AdminCaja from './pages/admin/AdminCaja';
import AdminPersonal from './pages/admin/AdminPersonal';
import AdminReportes from './pages/admin/AdminReportes';
import AdminReclamaciones from './pages/admin/AdminReclamaciones';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminReservas from './pages/admin/AdminReservas';

function AdminRoute({ children }) {
  return sessionStorage.getItem('mpp_admin_authenticated') === 'true'
    ? children
    : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/carta" element={<Carta />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/ubicacion" element={<Ubicacion />} />
        <Route path="/reclamaciones" element={<Reclamaciones />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/pos" element={<AdminRoute><AdminPOS /></AdminRoute>} />
        <Route path="/admin/reservas" element={<AdminRoute><AdminReservas /></AdminRoute>} />
        <Route path="/admin/menu" element={<AdminRoute><AdminMenu /></AdminRoute>} />
        <Route path="/admin/inventario" element={<AdminRoute><AdminInventario /></AdminRoute>} />
        <Route path="/admin/caja" element={<AdminRoute><AdminCaja /></AdminRoute>} />
        <Route path="/admin/personal" element={<AdminRoute><AdminPersonal /></AdminRoute>} />
        <Route path="/admin/reportes" element={<AdminRoute><AdminReportes /></AdminRoute>} />
        <Route path="/admin/reclamaciones" element={<AdminRoute><AdminReclamaciones /></AdminRoute>} />
        <Route path="/admin/usuarios" element={<AdminRoute><AdminUsuarios /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
