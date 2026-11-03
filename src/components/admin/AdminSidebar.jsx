import React from 'react';
import '../../styles/Admin/AdminSidebar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUtensils,
  FaBookOpen,
  FaBoxes,
  FaCashRegister,
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaUserCog
} from 'react-icons/fa';
import { RiReservedFill } from 'react-icons/ri';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const menuItems = [
    { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt, exact: true },
    { to: '/admin/pos', label: 'POS y Pedidos', icon: FaUtensils },
    { to: '/admin/reservas', label: 'Reservas', icon: RiReservedFill },
    { to: '/admin/menu', label: 'Catálogo y Menú', icon: FaBookOpen },
    { to: '/admin/inventario', label: 'Inventario y Almacén', icon: FaBoxes },
    { to: '/admin/caja', label: 'Caja y Facturación', icon: FaCashRegister },
    { to: '/admin/personal', label: 'Personal y Accesos', icon: FaUsers },
    { to: '/admin/reportes', label: 'Reportes y Estadísticas', icon: FaChartLine },
    { to: '/admin/reclamaciones', label: 'Libro de Reclamaciones', icon: FaClipboardList },
    { to: '/admin/usuarios', label: 'Administración de Usuarios', icon: FaUserCog },
  ];

  const cerrarSesion = () => {
    sessionStorage.removeItem('mpp_admin_authenticated');
    navigate('/login', { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-brand">
          <div className="mpp-logo-badge">
            <span>MPP</span>
          </div>

          <div>
            <div className="admin-brand-name">Mi Propiedad</div>
            <div className="admin-brand-caption">PANEL DE CONTROL</div>
          </div>
        </div>

        <ul className="admin-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  <span className="admin-menu-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="admin-sidebar-bottom">
        <div className="admin-user-card">
          <span className="admin-user-avatar">A</span>
          <span><strong>Administrador</strong><small>Sesión activa</small></span>
        </div>
        <button type="button" className="admin-logout-button" onClick={cerrarSesion}>
          <span aria-hidden="true">↪</span>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}