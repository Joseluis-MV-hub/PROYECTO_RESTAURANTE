import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminCaja() {
  const [comprobantes] = useState([
    { id: 'B001-00245', hora: '13:15', cliente: 'Juan Pérez', metodo: 'Tarjeta Visa', total: 124.00, tipo: 'Boleta' },
    { id: 'F001-00112', hora: '13:45', cliente: 'Inversiones Gastronómicas S.A.C.', metodo: 'Transferencia', total: 450.00, tipo: 'Factura' },
    { id: 'B001-00246', hora: '14:20', cliente: 'María Rodríguez', metodo: 'Yape', total: 65.00, tipo: 'Boleta' },
    { id: 'B001-00247', hora: '15:10', cliente: 'Carlos Mendoza', metodo: 'Efectivo', total: 95.00, tipo: 'Boleta' },
    { id: 'B001-00248', hora: '20:30', cliente: 'Laura Gómez', metodo: 'Plin', total: 180.00, tipo: 'Boleta' },
    { id: 'B001-00249', hora: '21:15', cliente: 'Jorge Silva', metodo: 'Tarjeta Mastercard', total: 210.00, tipo: 'Boleta' }
  ]);

  const [cajaCerrada, setCajaCerrada] = useState(false);

  return (
    <AdminLayout title="Caja y Facturación">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Ventas Efectivo</div>
          <div className="kpi-value">S/ 3,450.00</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>En gaveta de caja</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Tarjetas POS</div>
          <div className="kpi-value">S/ 6,240.00</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Visa, Mastercard, Amex</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Billeteras Yape / Plin</div>
          <div className="kpi-value">S/ 2,760.00</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Pagos QR validados</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Recaudado Hoy</div>
          <div className="kpi-value" style={{ color: 'var(--gold-secondary)' }}>S/ 12,450.00</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>Estado: Cuadrado</small>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-dark)', display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Comprobantes Emitidos en la Jornada</h4>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>SUNAT Conectado (Simulado)</span>
          </div>

          <table className="mpp-table">
            <thead>
              <tr>
                <th>Nº Comprobante</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Método</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {comprobantes.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong> <small style={{ color: 'var(--gold-secondary)' }}>({c.tipo})</small></td>
                  <td>{c.hora}</td>
                  <td>{c.cliente}</td>
                  <td>{c.metodo}</td>
                  <td style={{ fontWeight: 'bold' }}>S/ {c.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          borderRadius: '6px',
          padding: '20px',
          height: 'fit-content'
        }}>
          <h4 style={{ margin: '0 0 16px', color: '#fff', fontSize: '16px' }}>Cuadre y Cierre de Turno</h4>

          {cajaCerrada ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ color: '#48bb78', fontSize: '32px', marginBottom: '10px' }}>✓</div>
              <h5 style={{ color: '#fff' }}>Caja Cerrada Exitosamente</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Reporte Z generado y archivado. Fondos conciliados.
              </p>
              <button
                className="btn-outline-gold"
                style={{ fontSize: '12px', marginTop: '10px' }}
                onClick={() => setCajaCerrada(false)}
              >
                Reabrir Turno
              </button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.8' }}>
                <div><strong>Apertura de Caja:</strong> S/ 300.00</div>
                <div><strong>Total Ingresos:</strong> S/ 12,450.00</div>
                <div><strong>Egresos menores:</strong> - S/ 150.00</div>
                <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '8px', color: '#fff', fontSize: '15px' }}>
                  <strong>Saldo Esperado:</strong> <span style={{ color: 'var(--gold-secondary)' }}>S/ 12,600.00</span>
                </div>
              </div>

              <button
                className="btn-gold"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => setCajaCerrada(true)}
              >
                Cerrar Caja del Turno (Reporte Z)
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

