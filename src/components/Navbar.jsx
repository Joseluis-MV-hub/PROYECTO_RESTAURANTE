import React from 'react';
import "../styles/Navbar.css";
import { NavLink, Link } from 'react-router-dom';
import logo from '../img/logo 1.jpeg';

export default function Navbar() {
  return (
    <header className="mpp-navbar">
      <Link to="/" className="mpp-logo" aria-label="Ir al inicio">
        <img src={logo} alt="Logo del restaurante" className="mpp-logo-image" />
      </Link>

      <nav>
        <ul className="mpp-nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/nosotros" className={({ isActive }) => (isActive ? 'active' : '')}>
              Nosotros
            </NavLink>
          </li>
          <li>
            <NavLink to="/carta" className={({ isActive }) => (isActive ? 'active' : '')}>
              Carta
            </NavLink>
          </li>
          <li>
            <NavLink to="/galeria" className={({ isActive }) => (isActive ? 'active' : '')}>
              Galería
            </NavLink>
          </li>
          <li>
            <NavLink to="/ubicacion" className={({ isActive }) => (isActive ? 'active' : '')}>
              Ubicación
            </NavLink>
          </li>
          <li>
            <NavLink to="/reclamaciones" className={({ isActive }) => (isActive ? 'active' : '')}>
              Reclamaciones
            </NavLink>
          </li>
        </ul>
      </nav>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link to="/reservas" className="btn-gold">
          Reservar Mesa
        </Link>
        <Link to="/login" title="Iniciar Sesión" className="mpp-login-button">
          Login
        </Link>
      </div>
    </header>
  );
}
