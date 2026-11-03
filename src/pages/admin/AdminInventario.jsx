import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminInventario() {
  const [insumos, setInsumos] = useState([
    { id: 1, nombre: 'Pescado Corvina / Mero', cantidad: 18.5, unidad: 'kg', min: 10, estado: 'Óptimo' },
    { id: 2, nombre: 'Lomo Fino Res', cantidad: 6.2, unidad: 'kg', min: 10, estado: 'Bajo' },
    { id: 3, nombre: 'Pisco Quebranta 750ml', cantidad: 24, unidad: 'botellas', min: 12, estado: 'Óptimo' },
    { id: 4, nombre: 'Limón Sutil Peruano', cantidad: 4.0, unidad: 'kg', min: 8, estado: 'Crítico' },
    { id: 5, nombre: 'Papas Amarillas Tumbay', cantidad: 45, unidad: 'kg', min: 20, estado: 'Óptimo' },
    { id: 6, nombre: 'Cebolla Roja', cantidad: 22, unidad: 'kg', min: 15, estado: 'Óptimo' }
  ]);

  const [movimiento, setMovimiento] = useState({ insumoId: '1', tipo: 'Entrada', cantidad: '' });

  const aplicarMovimiento = (e) => {
    e.preventDefault();
    const cantNum = parseFloat(movimiento.cantidad);
    if (!cantNum) return;

    setInsumos(insumos.map((it) => {
      if (it.id === parseInt(movimiento.insumoId)) {
        const nuevaCant = movimiento.tipo === 'Entrada' ? it.cantidad + cantNum : Math.max(0, it.cantidad - cantNum);
        let nuevoEstado = 'Óptimo';
        if (nuevaCant <= it.min / 2) nuevoEstado = 'Crítico';
        else if (nuevaCant <= it.min) nuevoEstado = 'Bajo';
        return { ...it, cantidad: nuevaCant, estado: nuevoEstado };
      }
      return it;
    }));
    setMovimiento({ ...movimiento, cantidad: '' });
  };

  return (
    <AdminLayout title="Inventario y Almacén">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Valor Total en Stock</div>
          <div className="kpi-value" style={{ color: 'var(--gold-secondary)' }}>S/ 45,822.00</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Actualizado hoy</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">% de Merma Promedio</div>
          <div className="kpi-value">3.0%</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>Dentro del estándar</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Insumos en Estado Crítico</div>
          <div className="kpi-value" style={{ color: '#f56565' }}>2</div>
          <small style={{ color: '#f56565', fontSize: '11px' }}>Requieren reposición inmediata</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Proveedores Registrados</div>
          <div className="kpi-value">8</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Último pedido hace 2 días</small>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '6px', overflow: 'hidden' }}>
          <table className="mpp-table">
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Stock Actual</th>
                <th>Stock Mínimo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {insumos.map((it) => (
                <tr key={it.id}>
                  <td><strong>{it.nombre}</strong></td>
                  <td>{it.cantidad} {it.unidad}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{it.min} {it.unidad}</td>
                  <td>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: it.estado === 'Óptimo' ? 'rgba(72,187,120,0.15)' : it.estado === 'Bajo' ? 'rgba(237,137,54,0.15)' : 'rgba(229,62,62,0.15)',
                      color: it.estado === 'Óptimo' ? '#48bb78' : it.estado === 'Bajo' ? '#ed8936' : '#f56565'
                    }}>
                      {it.estado}
                    </span>
                  </td>
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
          <h4 style={{ margin: '0 0 16px', color: '#fff', fontSize: '16px' }}>Registro de Entrada / Salida</h4>
          <form onSubmit={aplicarMovimiento}>
            <div className="form-group-custom" style={{ marginBottom: '12px' }}>
              <label>Seleccionar Insumo</label>
              <select
                className="form-control-dark"
                value={movimiento.insumoId}
                onChange={(e) => setMovimiento({ ...movimiento, insumoId: e.target.value })}
              >
                {insumos.map((i) => (
                  <option key={i.id} value={i.id}>{i.nombre} ({i.unidad})</option>
                ))}
              </select>
            </div>

            <div className="form-group-custom" style={{ marginBottom: '12px' }}>
              <label>Tipo de Operación</label>
              <select
                className="form-control-dark"
                value={movimiento.tipo}
                onChange={(e) => setMovimiento({ ...movimiento, tipo: e.target.value })}
              >
                <option value="Entrada">Entrada (Compra de proveedor)</option>
                <option value="Salida">Salida (Consumo en cocina/merma)</option>
              </select>
            </div>

            <div className="form-group-custom" style={{ marginBottom: '16px' }}>
              <label>Cantidad</label>
              <input
                type="number"
                step="0.5"
                className="form-control-dark"
                placeholder="Ej. 5"
                value={movimiento.cantidad}
                onChange={(e) => setMovimiento({ ...movimiento, cantidad: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '10px' }}>
              Procesar Registro
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

