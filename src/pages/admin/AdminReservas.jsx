import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import '../../styles/Admin/AdminReservas.css';

const MESAS_INICIALES = Array.from({ length: 12 }, (_, index) => {
  const numero = index + 1;
  const estados = {
    2: 'Ocupada',
    4: 'Por cobrar',
    6: 'Ocupada',
    9: 'Ocupada',
    5: 'Fuera de servicio',
  };

  return {
    id: numero,
    numero: String(numero).padStart(2, '0'),
    capacidad: numero % 2 === 0 ? 4 : 2,
    zona: numero === 5 ? 'Terraza' : 'Salón',
    estado: estados[numero] || 'Libre',
    motivo: numero === 5 ? 'Pata rota - hasta el 03/11' : '',
    habilitada: numero !== 5,
  };
});

const leerLista = (clave, respaldo = []) => {
  try {
    const valor = JSON.parse(localStorage.getItem(clave) || 'null');
    return Array.isArray(valor) ? valor : respaldo;
  } catch {
    return respaldo;
  }
};

const codigoReserva = (reserva) => reserva.codigo || `#MPP-${String(reserva.id).slice(-6)}`;
const fechaComoClave = (fecha) => `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
const crearFormularioLocal = (fecha = fechaComoClave(new Date())) => ({
  fecha,
  nombre: '',
  personas: '40',
  motivo: 'Evento corporativo',
  desde: '12:00',
  hasta: '23:00',
  anticipo: '',
  cierraPublico: true,
});

export default function AdminReservas() {
  const [pestana, setPestana] = useState('mesas');
  const [mesas, setMesas] = useState(() => leerLista('mpp_admin_mesas', MESAS_INICIALES));
  const [reservas, setReservas] = useState(() => leerLista('mpp_reservas'));
  const [cierres, setCierres] = useState(() => leerLista('mpp_admin_cierres_local'));
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [mesaEnEdicion, setMesaEnEdicion] = useState(null);
  const [motivo, setMotivo] = useState('Mesa dañada');
  const [nuevaMesaAbierta, setNuevaMesaAbierta] = useState(false);
  const [nuevaMesa, setNuevaMesa] = useState({ numero: '', capacidad: '4', zona: 'Salón' });
  const [mesVisible, setMesVisible] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [fechaSeleccionada, setFechaSeleccionada] = useState(() => fechaComoClave(new Date()));
  const [reservaLocal, setReservaLocal] = useState(() => crearFormularioLocal());
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    localStorage.setItem('mpp_admin_mesas', JSON.stringify(mesas));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem('mpp_admin_cierres_local', JSON.stringify(cierres));
  }, [cierres]);

  useEffect(() => {
    const sincronizarReservas = (event) => {
      if (!event || event.key === 'mpp_reservas') setReservas(leerLista('mpp_reservas'));
    };

    window.addEventListener('storage', sincronizarReservas);
    return () => window.removeEventListener('storage', sincronizarReservas);
  }, []);

  const cambiarEstadoMesa = (event) => {
    event.preventDefault();
    setMesas((actuales) => actuales.map((mesa) => mesa.id === mesaEnEdicion
      ? { ...mesa, estado: 'Fuera de servicio', motivo, habilitada: false }
      : mesa));
    setMesaEnEdicion(null);
    setMensaje(`Mesa ${String(mesaEnEdicion).padStart(2, '0')} fuera de servicio.`);
  };

  const habilitarMesa = (mesaId) => {
    setMesas((actuales) => actuales.map((mesa) => mesa.id === mesaId
      ? { ...mesa, estado: 'Libre', motivo: '', habilitada: true }
      : mesa));
    setMesaEnEdicion(null);
    setMensaje(`Mesa ${String(mesaId).padStart(2, '0')} habilitada.`);
  };

  const alternarMesa = (mesa) => {
    setMesaSeleccionada(mesa.id);
    if (mesa.habilitada) {
      setMesaEnEdicion(mesa.id);
      setMotivo('Mesa dañada');
    } else {
      habilitarMesa(mesa.id);
    }
  };

  const guardarNuevaMesa = (event) => {
    event.preventDefault();
    const numero = Number(nuevaMesa.numero);
    if (mesas.some((mesa) => Number(mesa.numero) === numero)) {
      setMensaje(`La mesa ${String(numero).padStart(2, '0')} ya existe.`);
      return;
    }

    const agregada = {
      id: Date.now(),
      numero: String(numero).padStart(2, '0'),
      capacidad: Number(nuevaMesa.capacidad),
      zona: nuevaMesa.zona,
      estado: 'Libre',
      motivo: '',
      habilitada: true,
    };
    setMesas((actuales) => [...actuales, agregada].sort((a, b) => Number(a.numero) - Number(b.numero)));
    setNuevaMesaAbierta(false);
    setNuevaMesa({ numero: '', capacidad: '4', zona: 'Salón' });
    setMensaje(`Mesa ${agregada.numero} añadida.`);
  };

  const actualizarReserva = (id, campo, valor) => {
    const actualizadas = reservas.map((reserva) => reserva.id === id
      ? { ...reserva, [campo]: valor }
      : reserva);
    setReservas(actualizadas);
    localStorage.setItem('mpp_reservas', JSON.stringify(actualizadas));
    window.dispatchEvent(new Event('mpp:reservas-updated'));
  };

  const seleccionarFecha = (fecha) => {
    setFechaSeleccionada(fecha);
    const cierreExistente = cierres.find((cierre) => cierre.fecha === fecha);
    setReservaLocal(cierreExistente
      ? { ...crearFormularioLocal(fecha), ...cierreExistente }
      : crearFormularioLocal(fecha));
    setMensaje('');
  };

  const actualizarReservaLocal = (event) => {
    const { name, value, checked, type } = event.target;
    setReservaLocal((actual) => ({ ...actual, [name]: type === 'checkbox' ? checked : value }));
  };

  const guardarReservaLocal = (event) => {
    event.preventDefault();
    const cierrePrevio = cierres.find((cierre) => cierre.fecha === fechaSeleccionada);
    const guardado = {
      ...reservaLocal,
      id: cierrePrevio?.id || Date.now(),
      estado: reservaLocal.cierraPublico ? 'Cerrado' : 'Reservado',
    };
    const actualizados = cierrePrevio
      ? cierres.map((cierre) => cierre.id === cierrePrevio.id ? guardado : cierre)
      : [...cierres, guardado];
    setCierres(actualizados);
    localStorage.setItem('mpp_admin_cierres_local', JSON.stringify(actualizados));
    setMensaje(reservaLocal.cierraPublico ? 'Cierre del local confirmado.' : 'Reserva del local registrada.');
  };

  const reabrirLocal = (cierreId) => {
    setCierres((actuales) => actuales.map((cierre) => cierre.id === cierreId
      ? { ...cierre, estado: 'Abierto', cierraPublico: false }
      : cierre));
  };

  const cambiarMes = (cantidad) => {
    setMesVisible((actual) => new Date(actual.getFullYear(), actual.getMonth() + cantidad, 1));
  };

  const espaciosAntes = (new Date(mesVisible.getFullYear(), mesVisible.getMonth(), 1).getDay() + 6) % 7;
  const diasDelMes = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + 1, 0).getDate();
  const diasCalendario = [...Array(espaciosAntes).fill(null), ...Array.from({ length: diasDelMes }, (_, index) => index + 1)];
  const cierresActivos = cierres.filter((cierre) => cierre.estado === 'Cerrado');
  const hoy = fechaComoClave(new Date());
  const proximoCierre = cierresActivos
    .filter((cierre) => cierre.fecha >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
  const reservasActivas = mesas.filter((mesa) => mesa.habilitada).length;

  return (
    <AdminLayout title="Reservas">
      <div className="admin-reservas-page">
        <div className="admin-reservas-tabs" role="tablist" aria-label="Tipo de reserva">
          <button type="button" role="tab" aria-selected={pestana === 'mesas'} className={pestana === 'mesas' ? 'active' : ''} onClick={() => setPestana('mesas')}>
            Reserva de Mesas
          </button>
          <button type="button" role="tab" aria-selected={pestana === 'local'} className={pestana === 'local' ? 'active' : ''} onClick={() => setPestana('local')}>
            Reserva de Local
          </button>
          <button type="button" role="tab" aria-selected={pestana === 'gestion'} className={pestana === 'gestion' ? 'active' : ''} onClick={() => setPestana('gestion')}>
            Gestión de Mesas
          </button>
        </div>

        {pestana === 'mesas' || pestana === 'gestion' ? (
          <div className="admin-reservas-grid">
            <section className="reservas-main-column" aria-label="Mapa y estado de mesas">
              {pestana === 'gestion' && (
                <div className="reservas-panel">
                  <div className="reservas-panel-heading">
                    <h3>Mapa de Mesas</h3>
                    <span>{mesas.length} mesas</span>
                    <div className="reservas-legend">
                      <span className="legend-libre">● Libre</span>
                      <span className="legend-ocupada">● Ocupada</span>
                      <span className="legend-cobrar">● Por cobrar</span>
                    </div>
                  </div>
                  <div className="reservas-table-map">
                    {mesas.map((mesa) => (
                      <button
                        type="button"
                        key={mesa.id}
                        className={`reservas-table-tile status-${mesa.estado.toLowerCase().replaceAll(' ', '-')}${mesaSeleccionada === mesa.id ? ' selected' : ''}`}
                        onClick={() => setMesaSeleccionada(mesa.id)}
                        aria-pressed={mesaSeleccionada === mesa.id}
                      >
                        <strong>{mesa.numero}</strong>
                        <span>{mesa.estado}</span>
                        {mesa.motivo && <small>{mesa.motivo}</small>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="reservas-panel reservas-table-panel">
                <div className="reservas-management-heading">
                  <div>
                    <h3>Gestión de mesas</h3>
                    <p>{reservasActivas} operativas · {mesas.length - reservasActivas} fuera de servicio · apaga el interruptor para sacar una mesa de servicio</p>
                  </div>
                  <button type="button" className="reservas-primary-button" onClick={() => {
                    const siguienteNumero = Math.max(0, ...mesas.map((mesa) => Number(mesa.numero))) + 1;
                    setNuevaMesa({ numero: String(siguienteNumero), capacidad: '4', zona: 'Salón' });
                    setNuevaMesaAbierta(true);
                    setMensaje('');
                  }}>+ Añadir Mesa</button>
                </div>
                <div className="reservas-table-scroll">
                  <table className="admin-reservas-table">
                    <thead>
                      <tr><th>Mesa</th><th>Capacidad</th><th>Zona</th><th>Estado</th><th>Motivo / nota</th><th>Habilitada</th></tr>
                    </thead>
                    <tbody>
                      {mesas.map((mesa) => (
                        <tr key={mesa.id} className={mesa.estado === 'Fuera de servicio' ? 'row-out-of-service' : ''}>
                          <td>Mesa {mesa.numero}</td>
                          <td>{mesa.capacidad} personas</td>
                          <td>{mesa.zona}</td>
                          <td><span className={`reservas-status status-${mesa.estado.toLowerCase().replaceAll(' ', '-')}`}>{mesa.estado}</span></td>
                          <td>{mesa.motivo || (mesa.estado === 'Libre' ? '—' : 'Con comanda abierta')}</td>
                          <td>
                            <button
                              type="button"
                              className={`reservas-switch ${mesa.habilitada ? 'is-on' : 'is-off'}`}
                              role="switch"
                              aria-checked={mesa.habilitada}
                              aria-label={`${mesa.habilitada ? 'Deshabilitar' : 'Habilitar'} mesa ${mesa.numero}`}
                              onClick={() => alternarMesa(mesa)}
                            ><span /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {mesaEnEdicion && (
                  <form className="reservas-status-editor" onSubmit={cambiarEstadoMesa}>
                    <strong>Estado de la Mesa N° {String(mesaEnEdicion).padStart(2, '0')}</strong>
                    <label htmlFor="reserva-motivo">¿Por qué sale de servicio?</label>
                    <select id="reserva-motivo" value={motivo} onChange={(event) => setMotivo(event.target.value)}>
                      <option>Mesa dañada</option>
                      <option>Mantenimiento</option>
                      <option>Limpieza profunda</option>
                      <option>Otro motivo</option>
                    </select>
                    <button type="submit" className="reservas-danger-button">Sacar de servicio</button>
                    <button type="button" className="reservas-cancel-button" onClick={() => setMesaEnEdicion(null)}>Cancelar</button>
                  </form>
                )}

                {nuevaMesaAbierta && (
                  <form className="reservas-new-table-form" onSubmit={guardarNuevaMesa}>
                    <strong>Añadir nueva mesa</strong>
                    <label>Número de Mesa<input type="number" min="1" value={nuevaMesa.numero} onChange={(event) => setNuevaMesa((actual) => ({ ...actual, numero: event.target.value }))} required /></label>
                    <label>Capacidad<select value={nuevaMesa.capacidad} onChange={(event) => setNuevaMesa((actual) => ({ ...actual, capacidad: event.target.value }))}><option value="2">2 personas</option><option value="4">4 personas</option><option value="6">6 personas</option><option value="8">8 personas</option><option value="10">10 personas</option></select></label>
                    <label>Zona<select value={nuevaMesa.zona} onChange={(event) => setNuevaMesa((actual) => ({ ...actual, zona: event.target.value }))}><option>Salón</option><option>Terraza</option><option>Privado</option></select></label>
                    <button type="submit" className="reservas-primary-button">Guardar Mesa</button>
                    <button type="button" className="reservas-cancel-button" onClick={() => setNuevaMesaAbierta(false)}>Cancelar</button>
                  </form>
                )}
                {mensaje && <p className="reservas-success" role="status">{mensaje}</p>}
              </div>
            </section>

            <aside className="reservas-panel reservas-online-panel">
              <div className="reservas-panel-heading">
                <h3>Reservas de la Página</h3>
                <span>{reservas.length} registradas</span>
              </div>
              {reservas.length === 0 ? (
                <p className="reservas-empty">Las nuevas reservas enviadas desde la web aparecerán aquí.</p>
              ) : (
                <div className="reservas-online-list">
                  <div className="reservas-online-columns"><span>CÓDIGO</span><span>MESA</span><span>DETALLE</span></div>
                  {[...reservas].reverse().map((reserva) => (
                    <article className="reservas-online-item" key={reserva.id}>
                      <div className="reservas-online-controls">
                        <strong>{codigoReserva(reserva)}</strong>
                        <select aria-label={`Mesa para ${reserva.nombre || 'la reserva'}`} value={reserva.mesa || ''} onChange={(event) => actualizarReserva(reserva.id, 'mesa', event.target.value)}>
                          <option value="">Sin asignar</option>
                          {mesas.map((mesa) => <option key={mesa.id} value={mesa.numero} disabled={!mesa.habilitada}>Mesa {mesa.numero}</option>)}
                        </select>
                        <select aria-label={`Estado de ${reserva.nombre || 'la reserva'}`} value={reserva.estado || 'Confirmada'} onChange={(event) => actualizarReserva(reserva.id, 'estado', event.target.value)}>
                          <option>Confirmada</option><option>Pendiente</option><option>Borrador</option><option>Cancelada</option>
                        </select>
                      </div>
                      <p><strong>{reserva.nombre || 'Reserva de local'}</strong> · {reserva.personas || '—'} personas</p>
                      <small>{reserva.fecha || 'Fecha por coordinar'} · {reserva.turno || 'Hora por coordinar'} · {reserva.sede || 'Miraflores'}</small>
                      <div className="reservas-payment-controls">
                        <select aria-label="Plataforma de pago" value={reserva.plataformaPago || 'Web'} onChange={(event) => actualizarReserva(reserva.id, 'plataformaPago', event.target.value)}>
                          <option>Web</option><option>Yape</option><option>Transferencia</option><option>Plin</option>
                        </select>
                        <label>S/ <input aria-label="Importe recibido" type="number" min="0" step="0.01" value={reserva.importe ?? ''} placeholder="0.00" onChange={(event) => actualizarReserva(reserva.id, 'importe', event.target.value === '' ? '' : Number(event.target.value))} /></label>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="reservas-local-layout">
            <section className="reservas-panel reservas-calendar-panel">
              <div className="reservas-upcoming-closure">
                <span>Próximo cierre</span>
                {proximoCierre ? (
                  <><strong>{new Date(`${proximoCierre.fecha}T12:00:00`).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric' })}</strong><small>{proximoCierre.motivo} · {proximoCierre.nombre}</small></>
                ) : <strong>Sin cierres programados</strong>}
              </div>
              <div className="reservas-calendar-header">
                <button type="button" aria-label="Mes anterior" onClick={() => cambiarMes(-1)}>‹</button>
                <h3>{mesVisible.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}</h3>
                <button type="button" aria-label="Mes siguiente" onClick={() => cambiarMes(1)}>›</button>
              </div>
              <div className="reservas-calendar-grid">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dia) => <span className="reservas-weekday" key={dia}>{dia}</span>)}
                {diasCalendario.map((dia, index) => {
                  if (!dia) return <span className="reservas-calendar-blank" key={`blank-${index}`} />;
                  const clave = fechaComoClave(new Date(mesVisible.getFullYear(), mesVisible.getMonth(), dia));
                  const cierre = cierres.find((item) => item.fecha === clave && item.estado !== 'Abierto');
                  return (
                    <button
                      type="button"
                      key={clave}
                      className={`reservas-calendar-day${fechaSeleccionada === clave ? ' is-selected' : ''}${clave === hoy ? ' is-today' : ''}${cierre?.estado === 'Cerrado' ? ' is-closed' : ''}${cierre?.estado === 'Reservado' ? ' is-booked' : ''}`}
                      aria-pressed={fechaSeleccionada === clave}
                      onClick={() => seleccionarFecha(clave)}
                    >
                      <span>{dia}</span>
                      {cierre ? <small>{cierre.estado}<br />{cierre.motivo}</small> : clave === hoy ? <small>Hoy · abierto</small> : null}
                    </button>
                  );
                })}
              </div>
            </section>

            <aside className="reservas-local-aside">
              <section className="reservas-panel reservas-local-panel">
                <div className="reservas-local-date-heading">
                  <div><h3>{new Date(`${fechaSeleccionada}T12:00:00`).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</h3><span>{cierres.find((cierre) => cierre.fecha === fechaSeleccionada)?.estado || 'Abierto'}</span></div>
                </div>
                <form className="reservas-local-form" onSubmit={guardarReservaLocal}>
                  <label>Cliente<input name="nombre" value={reservaLocal.nombre} onChange={actualizarReservaLocal} placeholder="Empresa o persona" required /></label>
                  <label>Personas<input type="number" min="1" name="personas" value={reservaLocal.personas} onChange={actualizarReservaLocal} required /></label>
                  <label className="reservas-local-notes">Motivo<input name="motivo" value={reservaLocal.motivo} onChange={actualizarReservaLocal} required /></label>
                  <label>Desde<input type="time" name="desde" value={reservaLocal.desde} onChange={actualizarReservaLocal} required /></label>
                  <label>Hasta<input type="time" name="hasta" value={reservaLocal.hasta} onChange={actualizarReservaLocal} required /></label>
                  <label className="reservas-local-notes">Anticipo (S/)<input type="number" min="0" step="0.01" name="anticipo" value={reservaLocal.anticipo} onChange={actualizarReservaLocal} placeholder="0.00" /></label>
                  <label className="reservas-close-toggle"><input type="checkbox" name="cierraPublico" checked={reservaLocal.cierraPublico} onChange={actualizarReservaLocal} /><span>Cerrar al público ese día<small>Bloquea nuevas reservas en la web</small></span></label>
                  {mensaje && <p className="reservas-success" role="status">{mensaje}</p>}
                  <button type="submit" className="reservas-primary-button">Confirmar cierre</button>
                  <button type="button" className="reservas-cancel-button" onClick={() => { setReservaLocal(crearFormularioLocal(fechaSeleccionada)); setMensaje(''); }}>Cancelar</button>
                </form>
              </section>

              <section className="reservas-panel reservas-closed-list">
                <div className="reservas-panel-heading"><h3>Días cerrados</h3><span>{cierresActivos.length} registrados</span></div>
                {cierresActivos.length === 0 ? <p className="reservas-empty">No hay días cerrados.</p> : cierresActivos.map((cierre) => (
                  <div className="reservas-closed-item" key={cierre.id}>
                    <span><strong>{new Date(`${cierre.fecha}T12:00:00`).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}</strong><small>{cierre.nombre} · {cierre.motivo}</small></span>
                    <button type="button" onClick={() => reabrirLocal(cierre.id)}>Reabrir</button>
                  </div>
                ))}
              </section>
            </aside>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}