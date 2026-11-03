import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminReportes() {
  const topPlatos = [
    { rank: 1, plato: 'Ceviche Clásico MPP', pedidos: 342, total: 11970.00, margen: '68%' },
    { rank: 2, plato: 'Lomo Saltado Criollo', pedidos: 285, total: 12825.00, margen: '62%' },
    { rank: 3, plato: 'Pisco Sour Tradicional', pedidos: 260, total: 7020.00, margen: '75%' },
    { rank: 4, plato: 'Anticuchos de Corazón', pedidos: 215, total: 6450.00, margen: '65%' },
    { rank: 5, plato: 'Arroz con Mariscos', pedidos: 190, total: 8550.00, margen: '58%' },
    { rank: 6, plato: 'Chicha Morada de la Casa (1L)', pedidos: 180, total: 2700.00, margen: '80%' }
  ];

  return (
    <AdminLayout title="Reportes y Estadísticas de Venta">
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-dark)',
        borderRadius: '6px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Período:</span>
          <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>01/10/2026 - 26/10/2026</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Canales:</span>
          <span className="btn-outline-gold" style={{ padding: '3px 10px', fontSize: '12px' }}>Salón + Delivery</span>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Facturado en el Mes</div>
          <div className="kpi-value" style={{ color: 'var(--gold-secondary)' }}>S/ 142,560.00</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>+12% vs. mes anterior</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Ticket Promedio</div>
          <div className="kpi-value">S/ 98.72</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Por grupo familiar/mesa</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Órdenes Atendidas</div>
          <div className="kpi-value">1,444</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>82% en salón físico</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Plato Estrella</div>
          <div className="kpi-value" style={{ fontSize: '18px', color: 'var(--gold-light)' }}>Ceviche Clásico</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>342 raciones vendidas</small>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-dark)' }}>
          <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Top Platos y Bebidas Más Rentables</h4>
        </div>

        <table className="mpp-table">
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Plato / Bebida</th>
              <th>Unidades Vendidas</th>
              <th>Total Facturado</th>
              <th>Margen Estimado</th>
            </tr>
          </thead>
          <tbody>
            {topPlatos.map((p) => (
              <tr key={p.rank}>
                <td>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: p.rank === 1 ? 'var(--gold-secondary)' : '#27272e',
                    color: p.rank === 1 ? '#000' : '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {p.rank}
                  </span>
                </td>
                <td><strong>{p.plato}</strong></td>
                <td>{p.pedidos} porciones</td>
                <td style={{ color: 'var(--gold-secondary)', fontWeight: 'bold' }}>S/ {p.total.toFixed(2)}</td>
                <td style={{ color: '#48bb78' }}>{p.margen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

