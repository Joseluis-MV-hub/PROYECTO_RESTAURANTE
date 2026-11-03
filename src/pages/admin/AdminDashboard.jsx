import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminDashboard() {
  const horasVentas = [
    { hora: '12:00', ventas: 450, altura: '35%' },
    { hora: '13:00', ventas: 1200, altura: '75%' },
    { hora: '14:00', ventas: 1650, altura: '95%' },
    { hora: '15:00', ventas: 890, altura: '50%' },
    { hora: '19:00', ventas: 980, altura: '60%' },
    { hora: '20:00', ventas: 1850, altura: '100%' },
    { hora: '21:00', ventas: 1420, altura: '80%' },
    { hora: '22:00', ventas: 710, altura: '45%' },
  ];

  const reservasRecientes = JSON.parse(localStorage.getItem('mpp_reservas') || '[]');

  return (
    <AdminLayout title="Dashboard General">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Ventas del Día</div>
          <div className="kpi-value" style={{ color: 'var(--gold-secondary)' }}>S/ 12,450.00</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>+14.8% vs. día anterior</small>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Órdenes Activas</div>
          <div className="kpi-value">14</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>8 en salón, 6 delivery</small>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Mesas Ocupadas</div>
          <div className="kpi-value">4 <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/ 8</span></div>
          <small style={{ color: 'var(--gold-light)', fontSize: '11px' }}>50% de ocupación</small>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Clientes Atendidos</div>
          <div className="kpi-value">128</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>Ticket prom.: S/ 97.20</small>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-dark)',
        borderRadius: '6px',
        padding: '20px 24px',
        marginBottom: '25px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h4 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>Ventas por Turno / Hora</h4>
          <span style={{ fontSize: '12px', color: 'var(--gold-secondary)' }}>Hoy: 26 de Octubre</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '10px' }}>
          {horasVentas.map((bar) => (
            <div key={bar.hora} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>S/{bar.ventas}</span>
              <div
                style={{
                  width: '28px',
                  height: bar.altura,
                  backgroundColor: 'var(--gold-secondary)',
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.3s'
                }}
              ></div>
              <span style={{ fontSize: '11px', color: '#ccc' }}>{bar.hora}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-dark)',
        borderRadius: '6px',
        padding: '20px'
      }}>
        <h4 style={{ margin: '0 0 16px', color: '#fff', fontSize: '15px' }}>
          Últimas Reservas Online Registradas
        </h4>

        {reservasRecientes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Aún no hay reservas registradas desde la web. (Puedes probar enviando una en la página de Reservas).
          </p>
        ) : (
          <table className="mpp-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>DNI</th>
                <th>Sede</th>
                <th>Fecha / Turno</th>
                <th>Personas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservasRecientes.slice(-5).reverse().map((res) => (
                <tr key={res.id}>
                  <td><strong>{res.nombre}</strong><br /><small style={{ color: 'var(--text-muted)' }}>{res.telefono}</small></td>
                  <td>{res.dni}</td>
                  <td>{res.sede}</td>
                  <td>{res.fecha} - {res.turno}</td>
                  <td>{res.personas} pers.</td>
                  <td>
                    <span style={{ color: '#48bb78', background: 'rgba(72,187,120,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                      {res.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

