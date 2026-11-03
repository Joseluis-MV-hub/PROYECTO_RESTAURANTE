import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const RECLAMACIONES_DEFAULT = [
  { id: 101, codigo: "REC-2026-001", fecha: "25/10/2026 21:15", tipo: "Reclamo", nombre: "Valeria Morales Mendoza", dni: "DNI: 72849102", telefono: "987 654 321", correo: "valeria@gmail.com", sede: "Miraflores", asunto: "Demora en entrega del plato de fondo", detalle: "Realizamos nuestro pedido a las 20:30 y el segundo plato demoró más de 50 minutos en llegar a la mesa.", peticion: "Mayor control en tiempos de cocina en horas punta.", estado: "En Proceso" },
  { id: 102, codigo: "REC-2026-002", fecha: "26/10/2026 14:30", tipo: "Queja", nombre: "Fernando Castro Silva", dni: "DNI: 45902183", telefono: "991 223 344", correo: "fernando@hotmail.com", sede: "San Isidro", asunto: "Atención poco cordial en recepción", detalle: "Teníamos reserva confirmada y nos hicieron esperar 20 minutos de pie sin explicación.", peticion: "Capacitación en trato al cliente.", estado: "Pendiente" },
  { id: 103, codigo: "REC-2026-003", fecha: "26/10/2026 19:40", tipo: "Sugerencia", nombre: "Claudia Benavides", dni: "DNI: 71209384", telefono: "965 443 211", correo: "claudia@yahoo.com", sede: "Miraflores", asunto: "Añadir opciones sin gluten en postres", detalle: "La comida estuvo excelente, pero nos gustaría ver postres aptos para personas celíacas.", peticion: "Incluir al menos dos postres sin gluten en la carta.", estado: "Atendido" },
];

export default function AdminReclamaciones() {
  const [reportes, setReportes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    try {
      const guardados = localStorage.getItem('mpp_reclamaciones');
      const parsed = guardados ? JSON.parse(guardados) : null;
      setReportes(Array.isArray(parsed) && parsed.length > 0 ? parsed : RECLAMACIONES_DEFAULT);
    } catch {
      setReportes(RECLAMACIONES_DEFAULT);
    }
  }, []);

  const cambiarEstado = (id, estado) => {
    const nuevos = reportes.map((r) => r.id === id ? { ...r, estado } : r);
    setReportes(nuevos);
    localStorage.setItem('mpp_reclamaciones', JSON.stringify(nuevos));
    if (detalle?.id === id) setDetalle({ ...detalle, estado });
  };

  const eliminar = (id) => {
    if (!window.confirm('¿Archivar este reporte?')) return;
    const nuevos = reportes.filter((r) => r.id !== id);
    setReportes(nuevos);
    localStorage.setItem('mpp_reclamaciones', JSON.stringify(nuevos));
    if (detalle?.id === id) setDetalle(null);
  };

  const filtrados = reportes.filter((r) =>
    (filtroTipo === 'Todos' || r.tipo === filtroTipo) &&
    (filtroEstado === 'Todos' || r.estado === filtroEstado)
  );

  const pendientes = reportes.filter((r) => r.estado === 'Pendiente').length;

  const colorTipo = (tipo) => ({ Reclamo: '#ed8936', Queja: '#f56565', Sugerencia: '#48bb78' }[tipo] || '#fff');
  const bgTipo = (tipo) => ({ Reclamo: 'rgba(237,137,54,0.15)', Queja: 'rgba(245,101,101,0.15)', Sugerencia: 'rgba(72,187,120,0.15)' }[tipo] || 'transparent');
  const colorEstado = (e) => ({ Atendido: '#48bb78', 'En Proceso': 'var(--gold-secondary)', Pendiente: '#f56565' }[e] || '#fff');

  return (
    <AdminLayout title="Libro de Reclamaciones — Reportes de Clientes">
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Reportes</div>
          <div className="kpi-value" style={{ color: 'var(--gold-secondary)' }}>{reportes.length}</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Canal Web y Físico</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Pendientes de Respuesta</div>
          <div className="kpi-value" style={{ color: pendientes > 0 ? '#f56565' : '#48bb78' }}>{pendientes}</div>
          <small style={{ color: pendientes > 0 ? '#f56565' : 'var(--text-muted)', fontSize: '11px' }}>{pendientes > 0 ? 'Requiere atención' : 'Al día'}</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Reclamos y Quejas</div>
          <div className="kpi-value">{reportes.filter((r) => ['Reclamo', 'Queja'].includes(r.tipo)).length}</div>
          <small style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Requieren seguimiento legal</small>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Sugerencias Recibidas</div>
          <div className="kpi-value" style={{ color: '#48bb78' }}>{reportes.filter((r) => r.tipo === 'Sugerencia').length}</div>
          <small style={{ color: '#48bb78', fontSize: '11px' }}>Feedback positivo de clientes</small>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '6px', padding: '14px 20px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tipo:</span>
            <select className="form-control-dark" style={{ width: '130px' }} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Reclamo">Reclamos</option>
              <option value="Queja">Quejas</option>
              <option value="Sugerencia">Sugerencias</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estado:</span>
            <select className="form-control-dark" style={{ width: '130px' }} value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="Todos">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Atendido">Atendido</option>
            </select>
          </div>
        </div>
        <span style={{ color: 'var(--gold-light)', fontSize: '13px' }}>
          Mostrando {filtrados.length} de {reportes.length} reportes
        </span>
      </div>

      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
        <table className="mpp-table">
          <thead>
            <tr>
              <th>Código / Fecha</th>
              <th>Consumidor</th>
              <th>Tipo</th>
              <th>Sede</th>
              <th>Asunto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No hay reportes con los filtros seleccionados.</td></tr>
            ) : filtrados.map((rep) => (
              <tr key={rep.id}>
                <td>
                  <strong style={{ color: 'var(--gold-secondary)' }}>{rep.codigo}</strong>
                  <br /><small style={{ color: 'var(--text-muted)' }}>{rep.fecha}</small>
                </td>
                <td>
                  <strong>{rep.nombre}</strong>
                  <br /><small style={{ color: 'var(--text-muted)' }}>{rep.telefono}</small>
                </td>
                <td>
                  <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: bgTipo(rep.tipo), color: colorTipo(rep.tipo) }}>
                    {rep.tipo}
                  </span>
                </td>
                <td>{rep.sede}</td>
                <td>
                  <div style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rep.asunto}</div>
                </td>
                <td>
                  <select
                    value={rep.estado}
                    onChange={(e) => cambiarEstado(rep.id, e.target.value)}
                    style={{ background: 'rgba(197,157,95,0.1)', color: colorEstado(rep.estado), border: '1px solid currentColor', borderRadius: '4px', padding: '3px 6px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    <option value="Pendiente" style={{ background: '#1c1c20', color: '#f56565' }}>Pendiente</option>
                    <option value="En Proceso" style={{ background: '#1c1c20', color: '#cfa86e' }}>En Proceso</option>
                    <option value="Atendido" style={{ background: '#1c1c20', color: '#48bb78' }}>Atendido</option>
                  </select>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => setDetalle(rep)} className="btn-outline-gold" style={{ padding: '3px 8px', fontSize: '11px' }}>Ver</button>
                    <button onClick={() => eliminar(rep.id)} style={{ background: 'transparent', border: 'none', color: '#f56565', cursor: 'pointer', fontSize: '13px' }} title="Archivar">✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalle && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: '#161310', border: '1px solid var(--border-gold)', borderRadius: '8px', maxWidth: '640px', width: '100%', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.9)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>Detalle: <span style={{ color: 'var(--gold-secondary)' }}>{detalle.codigo}</span></h3>
                <small style={{ color: 'var(--text-muted)' }}>Registrado el {detalle.fecha}</small>
              </div>
              <button onClick={() => setDetalle(null)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#ccc', marginBottom: '16px' }}>
              <div><strong>Nombre:</strong> {detalle.nombre}</div>
              <div><strong>Documento:</strong> {detalle.dni}</div>
              <div><strong>Teléfono:</strong> {detalle.telefono}</div>
              <div><strong>Correo:</strong> {detalle.correo}</div>
              <div><strong>Sede:</strong> {detalle.sede}</div>
              <div><strong>Tipo:</strong> <span style={{ color: colorTipo(detalle.tipo), fontWeight: 'bold' }}>{detalle.tipo}</span></div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '14px', color: '#fff', marginBottom: '8px' }}><strong>Asunto:</strong> {detalle.asunto}</div>
              <div style={{ background: 'rgba(25,20,16,0.9)', border: '1px solid rgba(197,157,95,0.2)', borderRadius: '6px', padding: '12px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '10px' }}>
                <strong style={{ color: '#fff' }}>Hechos:</strong><br />{detalle.detalle}
              </div>
              {detalle.peticion && (
                <div style={{ fontSize: '13px', color: 'var(--gold-light)', fontStyle: 'italic' }}>
                  <strong style={{ color: '#fff', fontStyle: 'normal' }}>Petición:</strong> "{detalle.peticion}"
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estado:</span>
                <select value={detalle.estado} onChange={(e) => cambiarEstado(detalle.id, e.target.value)} className="form-control-dark" style={{ width: '130px' }}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Atendido">Atendido</option>
                </select>
              </div>
              <button className="btn-gold" onClick={() => setDetalle(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
