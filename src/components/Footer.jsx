import React from 'react';
import "../styles/Footer.css";
import { Link } from 'react-router-dom';
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
 
  return (
    <footer className="mpp-footer">
      <div className="mpp-footer-grid">
 
        <div>
          <ul className="footer-nav">
            {[
              ['/', 'Inicio'],
              ['/nosotros', 'Nosotros'],
              ['/carta', 'Carta'],
              ['/reservas', 'Reservas'],
              ['/galeria', 'Galería'],
              ['/ubicacion', 'Ubicación'],
              ['/reclamaciones', 'Reclamaciones'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
 
          <p className="footer-address">
            Av. Principal 123, Lima, Perú
          </p>
 
          <p className="footer-phone">
            +51 997 568 990
          </p>

          <p className="footer-address">
            mipropiedadprivada@gmail.com
          </p>
        </div>
 
        <div>
          <h5 className="footer-heading">
            Ayudas y Legales:
          </h5>
 
          <ul className="footer-links-list">
            <li>
              <a href="#terminos">
                • Terminos y Condiciones
              </a>
            </li>
 
            <li>
              <a href="#privacidad">
                • Políticas de Privacidad
              </a>
            </li>
 
            <li>
              <a href="#cookies">
                • Políticas de Cookies
              </a>
            </li>
          </ul>
 
          <Link
            to="/reclamaciones"
            className="footer-claims-link"
            aria-label="Ir al Libro de Reclamaciones"
          >
            <span className="footer-claims-icon" aria-hidden="true">
              ▤
            </span>
 
            <span className="footer-claims-text">
              Libro de Reclamaciones
            </span>
 
            <span className="footer-claims-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
 
        <div>
          <h5 className="footer-heading">
            Síguenos en:
          </h5>
 
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-btn"
            aria-label="Facebook"
          >
            <span className="footer-social-icon footer-facebook">
              f
            </span>
 
            <span>@LaPropiedadPrivada</span>
          </a>
 
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-social-btn"
            aria-label="Instagram"
          >
            <span className="footer-social-icon footer-instagram">
              <FaInstagram size={15} />
            </span>
 
            <span>@LaPropiedadPrivada</span>
          </a>
        </div>
 
      </div>
 
      <div className="mpp-footer-bottom">
        © {currentYear} Mi Propiedad Privada. Todos los derechos reservados.
      </div>
    </footer>
  );
}
 