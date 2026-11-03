import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const MESAS_INICIALES = [
  { id: 1, numero: "01", capacidad: 4, estado: "ocupada", comanda: { ordenId: 1024, mozo: "Carlos M.", items: [{ nombre: "Ceviche Clásico", cantidad: 2, precio: 35 }, { nombre: "Pisco Sour", cantidad: 2, precio: 27 }], total: 124 } },
  { id: 2, numero: "02", capacidad: 2, estado: "libre", comanda: null },
  { id: 3, numero: "03", capacidad: 6, estado: "ocupada", comanda: { ordenId: 1025, mozo: "Ana R.", items: [{ nombre: "Lomo Saltado", cantidad: 3, precio: 45 }], total: 135 } },
  { id: 4, numero: "04", capacidad: 4, estado: "reservada", comanda: null },
  { id: 5, numero: "05", capacidad: 2, estado: "libre", comanda: null },
  { id: 6, numero: "06", capacidad: 8, estado: "ocupada", comanda: { ordenId: 1026, mozo: "Carlos M.", items: [{ nombre: "Arroz con Mariscos", cantidad: 4, precio: 45 }], total: 180 } },
  { id: 7, numero: "07", capacidad: 4, estado: "libre", comanda: null },
  { id: 8, numero: "08", capacidad: 4, estado: "libre", comanda: null },
];

export default function AdminPOS() {
  const [mesas, setMesas] = useState(MESAS_INICIALES);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(MESAS_INICIALES[0]);

  const seleccionarMesa = (mesa) => {
    setMesaSeleccionada(mesa);
  };

  const liberarMesa = (mesaId) => {
    const actualizadas = mesas.map((m) => {
      if (m.id === mesaId) {
        return { ...m, estado: 'libre', comanda: null };
      }
      return m;
    });
    setMesas(actualizadas);
    const m = actualizadas.find((m) => m.id === mesaId);
    setMesaSeleccionada(m);
  };

  const abrirMesa = (mesaId) => {
    const actualizadas = mesas.map((m) => {
      if (m.id === mesaId) {
        return {
          ...m,
          estado: 'ocupada',
          comanda: {
            ordenId: Math.floor(1000 + Math.random() * 9000),
            mozo: 'Carlos M.',
            items: [
              { nombre: 'Ceviche Clásico MPP', cantidad: 1, precio: 35 },
              { nombre: 'Chicha Morada 1L', cantidad: 1, precio: 15 }
            ],
            total: 50
          }
        };
      }
      return m;
    });
    setMesas(actualizadas);
    setMesaSeleccionada(actualizadas.find((m) => m.id === mesaId));
  };

  return (
    <AdminLayout title="POS y Pedidos en Salón">
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '25px' }}>
        <div>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-dark)',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>Mapa de Mesas</h4>
              <div style={{ display: 'flex', gap: '15px', fontSize: '12px' }}>
                <span style={{ color: 'var(--gold-secondary)' }}>● Ocupada</span>
                <span style={{ color: '#48bb78' }}>● Libre</span>
                <span style={{ color: '#63b3ed' }}>● Reservada</span>
              </div>
            </div>

            <div className="mesas-grid">
              {mesas.map((m) => (
                <button
                  key={m.id}
                  onClick={() => seleccionarMesa(m)}
                  className={`mesa-btn ${m.estado}`}
                  style={{
                    boxShadow: mesaSeleccionada?.id === m.id ? '0 0 0 2px #fff' : 'none'
                  }}
                >
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MESA</span>
                  <strong style={{ fontSize: '16px' }}>{m.numero}</strong>
                  <span style={{ fontSize: '9px' }}>{m.capacidad}p</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-dark)',
            borderRadius: '6px',
            padding: '20px'
          }}>
            <h4 style={{ margin: '0 0 14px', color: '#fff', fontSize: '15px' }}>Comandas en Curso</h4>
            <table className="mpp-table">
              <thead>
                <tr>
                  <th>Mesa</th>
                  <th>Orden</th>
                  <th>Mozo</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {mesas.filter((m) => m.comanda).map((m) => (
                  <tr key={m.id} onClick={() => seleccionarMesa(m)} style={{ cursor: 'pointer' }}>
                    <td>Mesa {m.numero}</td>
                    <td>#{m.comanda.ordenId}</td>
                    <td>{m.comanda.mozo}</td>
                    <td>S/ {m.comanda.total.toFixed(2)}</td>
                    <td><span style={{ color: 'var(--gold-primary)' }}>En consumo</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          borderRadius: '6px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ borderBottom: '1px solid var(--border-dark)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
                  Mesa {mesaSeleccionada?.numero}
                </h3>
                <span className={`mesa-btn ${mesaSeleccionada?.estado}`} style={{ width: 'auto', height: 'auto', padding: '2px 10px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase' }}>
                  {mesaSeleccionada?.estado}
                </span>
              </div>
              <small style={{ color: 'var(--text-muted)' }}>
                Capacidad: {mesaSeleccionada?.capacidad} comensales
              </small>
            </div>

            {mesaSeleccionada?.comanda ? (
              <>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  <div><strong>Comanda:</strong> #{mesaSeleccionada.comanda.ordenId}</div>
                  <div><strong>Mozo a cargo:</strong> {mesaSeleccionada.comanda.mozo}</div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '10px' }}>
                  <table style={{ width: '100%', fontSize: '13px', color: '#fff', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-dark)', fontSize: '11px' }}>
                        <th style={{ textAlign: 'left', padding: '6px 0' }}>ITEM</th>
                        <th style={{ textAlign: 'center' }}>CANT</th>
                        <th style={{ textAlign: 'right' }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mesaSeleccionada.comanda.items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #232328' }}>
                          <td style={{ padding: '8px 0' }}>{item.nombre}</td>
                          <td style={{ textAlign: 'center' }}>{item.cantidad}</td>
                          <td style={{ textAlign: 'right' }}>S/ {(item.cantidad * item.precio).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ borderTop: '1px solid var(--border-gold)', marginTop: '20px', paddingTop: '14px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Subtotal:</span>
                    <span>S/ {(mesaSeleccionada.comanda.total / 1.18).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>I.G.V. (18%):</span>
                    <span>S/ ({(mesaSeleccionada.comanda.total - mesaSeleccionada.comanda.total / 1.18).toFixed(2)})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                    <span>TOTAL:</span>
                    <span style={{ color: 'var(--gold-secondary)' }}>S/ {mesaSeleccionada.comanda.total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <p>Esta mesa se encuentra libre en este momento.</p>
                <button
                  className="btn-gold"
                  onClick={() => abrirMesa(mesaSeleccionada.id)}
                  style={{ fontSize: '13px' }}
                >
                  + Abrir Comanda / Ocupar Mesa
                </button>
              </div>
            )}
          </div>

          {mesaSeleccionada?.comanda && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn-gold"
                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
                onClick={() => liberarMesa(mesaSeleccionada.id)}
              >
                Cobrar y Liberar Mesa (S/ {mesaSeleccionada.comanda.total.toFixed(2)})
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

