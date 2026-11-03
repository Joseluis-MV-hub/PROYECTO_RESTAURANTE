import React, { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import '../../styles/Admin/AdminLayout.css';
import { FaBell } from 'react-icons/fa';

const readStoredArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export default function AdminLayout({ title, children }) {
  const [reservas, setReservas] = useState(() => readStoredArray('mpp_reservas'));
  const [notificacionesVistas, setNotificacionesVistas] = useState(() =>
    readStoredArray('mpp_admin_reservas_vistas').map(String)
  );
  const [notificacionesAbiertas, setNotificacionesAbiertas] = useState(false);

  useEffect(() => {
    const actualizarReservas = () => setReservas(readStoredArray('mpp_reservas'));
    const sincronizarStorage = (event) => {
      if (event.key === 'mpp_reservas') actualizarReservas();
      if (event.key === 'mpp_admin_reservas_vistas') {
        setNotificacionesVistas(readStoredArray('mpp_admin_reservas_vistas').map(String));
      }
    };

    window.addEventListener('storage', sincronizarStorage);
    window.addEventListener('mpp:reservas-updated', actualizarReservas);
    return () => {
      window.removeEventListener('storage', sincronizarStorage);
      window.removeEventListener('mpp:reservas-updated', actualizarReservas);
    };
  }, []);

  const noLeidas = reservas.filter((reserva) => !notificacionesVistas.includes(String(reserva.id)));

  const alternarNotificaciones = () => {
    if (!notificacionesAbiertas) {
      const idsVistos = reservas.map((reserva) => String(reserva.id));
      localStorage.setItem('mpp_admin_reservas_vistas', JSON.stringify(idsVistos));
      setNotificacionesVistas(idsVistos);
    }
    setNotificacionesAbiertas(!notificacionesAbiertas);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h2 className="admin-page-title">{title}</h2>
            <span className="admin-page-subtitle">
              Restaurante Mi Propiedad Privada - Sistema Interno
            </span>
          </div>

          <div className="admin-topbar-status">
            <div className="admin-notifications">
              <button
                type="button"
                className="admin-notification-button"
                aria-label={`Notificaciones${noLeidas.length ? `: ${noLeidas.length} nuevas` : ''}`}
                aria-expanded={notificacionesAbiertas}
                title="Notificaciones de reservas"
                onClick={alternarNotificaciones}
              >
                <FaBell aria-hidden="true" />
                {noLeidas.length > 0 && <span className="admin-notification-count">{noLeidas.length}</span>}
              </button>
              {notificacionesAbiertas && (
                <div className="admin-notification-panel">
                  <h3>Reservas nuevas</h3>
                  {reservas.length === 0 ? (
                    <p>No hay reservas registradas.</p>
                  ) : (
                    <ul>
                      {[...reservas].reverse().slice(0, 5).map((reserva) => (
                        <li key={reserva.id}>
                          <strong>{reserva.nombre || 'Reserva de local'}</strong>
                          <span>{reserva.fecha} · {reserva.turno || 'Por coordinar'}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <span className="admin-status-indicator">
              🟢 Modo Online (Simulado)
            </span>

            <div className="admin-user-badge">AD</div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}