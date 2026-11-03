import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminUsuarios() {
  const [usuarios] = useState([
    { id: 1, nombre: 'Administrador General', user: 'admin@mpp.pe', rol: 'Super Admin', permisos: 'Acceso Total', estado: 'Activo' },
    { id: 2, nombre: 'Carlos Mendoza', user: 'carlos.mozo@mpp.pe', rol: 'Mozo / POS', permisos: 'POS y Pedidos', estado: 'Activo' },
    { id: 3, nombre: 'Ana Ramírez', user: 'ana.moza@mpp.pe', rol: 'Mozo / POS', permisos: 'POS y Pedidos', estado: 'Activo' },
    { id: 4, nombre: 'Roberto Sánchez', user: 'roberto.caja@mpp.pe', rol: 'Cajero', permisos: 'Caja, Facturación y POS', estado: 'Activo' },
    { id: 5, nombre: 'Luis Flores', user: 'luis.chef@mpp.pe', rol: 'Cocina', permisos: 'Comandas e Inventario', estado: 'Activo' },
    { id: 6, nombre: 'Valeria Castillo', user: 'valeria.bar@mpp.pe', rol: 'Barra', permisos: 'Comandas de Bebidas', estado: 'Activo' },
  ]);

  return (
    <AdminLayout title="Administración de Usuarios y Permisos">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Usuarios del Sistema</div>
          <div className="kpi-value">6</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Con credenciales activas</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Roles Definidos</div>
          <div className="kpi-value">4</div>
          <small style={{ color: 'var(--gold-light)', fontSize: '11px' }}>Admin, Mozo, Caja, Cocina</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Sesiones Activas</div>
          <div className="kpi-value" style={{ color: '#48bb78' }}>3</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>Terminales sincronizadas</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Seguridad y Políticas</div>
          <div className="kpi-value" style={{ fontSize: '18px', color: 'var(--gold-secondary)' }}>Protegido</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Autenticación encriptada</small>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '6px', overflow: 'hidden' }}>
        <table className="mpp-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo / Login</th>
              <th>Rol en Restaurante</th>
              <th>Alcance de Permisos</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.nombre}</strong></td>
                <td><code style={{ color: 'var(--gold-light)', fontSize: '12px' }}>{u.user}</code></td>
                <td>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    backgroundColor: u.rol.includes('Admin') ? 'rgba(212,175,55,0.2)' : '#23232b',
                    color: u.rol.includes('Admin') ? 'var(--gold-secondary)' : '#fff'
                  }}>
                    {u.rol}
                  </span>
                </td>
                <td>{u.permisos}</td>
                <td>
                  <span style={{ color: '#48bb78', fontSize: '12px' }}>● {u.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

