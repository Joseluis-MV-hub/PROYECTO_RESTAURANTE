import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminPersonal() {
  const [personal] = useState([
    { id: 1, nombre: 'Carlos Mendoza', cargo: 'Mozo Principal', turno: 'Tarde / Noche (18:00 - 00:00)', telefono: '987 112 233', estado: 'Activo en Turno' },
    { id: 2, nombre: 'Ana Ramírez', cargo: 'Moza de Salón', turno: 'Tarde / Noche (18:00 - 00:00)', telefono: '976 223 344', estado: 'Activo en Turno' },
    { id: 3, nombre: 'Luis Flores', cargo: 'Chef Ejecutivo', turno: 'Completo (11:00 - 21:00)', telefono: '998 334 455', estado: 'Activo en Turno' },
    { id: 4, nombre: 'Valeria Castillo', cargo: 'Bartender', turno: 'Noche (19:00 - 01:00)', telefono: '981 445 566', estado: 'Activo en Turno' },
    { id: 5, nombre: 'Roberto Sánchez', cargo: 'Cajero / Administrador', turno: 'Día (11:00 - 19:00)', telefono: '984 556 677', estado: 'Descanso' },
    { id: 6, nombre: 'Elena Vega', cargo: 'Ayudante de Cocina', turno: 'Tarde / Noche (17:00 - 23:30)', telefono: '971 667 788', estado: 'Activo en Turno' }
  ]);

  return (
    <AdminLayout title="Personal y Control de Turnos">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Plantilla Total</div>
          <div className="kpi-value">24</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Cocina, Salón, Bar, Caja</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Personal en Turno Hoy</div>
          <div className="kpi-value" style={{ color: '#48bb78' }}>14</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>100% de asistencia esperada</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">En Descanso / Francos</div>
          <div className="kpi-value">10</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Rotación programada</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Faltas / Incidencias</div>
          <div className="kpi-value">0</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>Sin reportes pendientes</small>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '6px', overflow: 'hidden' }}>
        <table className="mpp-table">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Cargo</th>
              <th>Turno Programado</th>
              <th>Contacto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {personal.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.nombre}</strong></td>
                <td>
                  <span style={{ color: 'var(--gold-secondary)' }}>{p.cargo}</span>
                </td>
                <td>{p.turno}</td>
                <td>{p.telefono}</td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    background: p.estado.includes('Activo') ? 'rgba(72,187,120,0.15)' : 'rgba(160,174,192,0.15)',
                    color: p.estado.includes('Activo') ? '#48bb78' : '#a0aec0'
                  }}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

