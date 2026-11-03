import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { MESAS_INICIALES, leerReservas, obtenerMesasDisponibles } from '../../data/reservas';
import '../../styles/Admin/AdminReservas.css';

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
const minutosDeHora = (hora) => {
  const [horas, minutos] = String(hora || '0:0').split(':').map(Number);
  return horas * 60 + minutos;
};
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
  const [reservas, setReservas] = useState(leerReservas);
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
  const [fechaAgenda, setFechaAgenda] = useState(() => fechaComoClave(new Date()));
  const [zonaAgenda, setZonaAgenda] = useState('Todas las zonas');
  const [turnoAgenda, setTurnoAgenda] = useState('Cena');
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);
  const [nuevaReservaAbierta, setNuevaReservaAbierta] = useState(true);
  const [formularioReserva, setFormularioReserva] = useState(() => ({
    fecha: fechaComoClave(new Date()),
    turno: '20:30',
    personas: '4',
    duracion: '105',
    nombre: '',
    telefono: '',
    mesa: '',
  }));
  const [errorReservaAgenda, setErrorReservaAgenda] = useState('');

  useEffect(() => {
    localStorage.setItem('mpp_admin_mesas', JSON.stringify(mesas));
    window.dispatchEvent(new Event('mpp:mesas-updated'));
  }, [mesas]);

  useEffect(() => {
    localStorage.setItem('mpp_admin_cierres_local', JSON.stringify(cierres));
    window.dispatchEvent(new Event('mpp:closures-updated'));
  }, [cierres]);

  useEffect(() => {
    const sincronizarReservas = (event) => {
      if (!event || event.key === 'mpp_reservas' || event.type === 'mpp:reservas-updated') setReservas(leerReservas());
    };

    window.addEventListener('storage', sincronizarReservas);
    window.addEventListener('mpp:reservas-updated', sincronizarReservas);
    return () => {
      window.removeEventListener('storage', sincronizarReservas);
      window.removeEventListener('mpp:reservas-updated', sincronizarReservas);
    };
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

  const cambiarCampoNuevaReserva = (event) => {
    const { name, value } = event.target;
    setFormularioReserva((actual) => ({ ...actual, [name]: value, ...(name === 'fecha' || name === 'turno' || name === 'personas' || name === 'duracion' ? { mesa: '' } : {}) }));
    setErrorReservaAgenda('');
  };

  const guardarNuevaReserva = (event) => {
    event.preventDefault();
    const fechaCerrada = cierres.some((cierre) => cierre.fecha === formularioReserva.fecha && cierre.estado === 'Cerrado');
    if (fechaCerrada) {
      setErrorReservaAgenda('El local está cerrado en esa fecha.');
      return;
    }

    const disponibles = obtenerMesasDisponibles({
      mesas,
      reservas,
      fecha: formularioReserva.fecha,
      turno: formularioReserva.turno,
      personas: formularioReserva.personas,
      duracion: formularioReserva.duracion,
    });
    const mesa = disponibles.find((item) => String(item.numero) === String(formularioReserva.mesa))
      || (!formularioReserva.mesa ? disponibles[0] : null);

    if (!mesa) {
      setErrorReservaAgenda(formularioReserva.mesa ? 'Esa mesa ya no está disponible en ese horario.' : 'No hay mesas disponibles para ese horario y cantidad de personas.');
      return;
    }

    const id = Date.now();
    const nueva = {
      id,
      codigo: `MPP-AD-${String(id).slice(-4)}`,
      nombre: formularioReserva.nombre.trim(),
      telefono: formularioReserva.telefono.trim(),
      fecha: formularioReserva.fecha,
      turno: formularioReserva.turno,
      personas: formularioReserva.personas,
      duracion: Number(formularioReserva.duracion),
      mesa: mesa.numero,
      sede: mesa.zona,
      estado: 'Confirmada',
      plataformaPago: 'Local',
      importe: 0,
      origen: 'Administración',
    };
    const actualizadas = [...reservas, nueva];
    setReservas(actualizadas);
    localStorage.setItem('mpp_reservas', JSON.stringify(actualizadas));
    window.dispatchEvent(new Event('mpp:reservas-updated'));
    setFechaAgenda(nueva.fecha);
    setFormularioReserva((actual) => ({ ...actual, mesa: '', nombre: '' }));
    setErrorReservaAgenda('');
    setMensaje(`Reserva confirmada para ${nueva.nombre}, Mesa ${nueva.mesa}.`);
  };

  const reabrirLocal = (cierreId) => {
    setCierres((actuales) => actuales.map((cierre) => cierre.id === cierreId
      ? { ...cierre, estado: 'Abierto', cierraPublico: false }
      : cierre));
  };

  const cambiarDiaAgenda = (cantidad) => {
    const fecha = new Date(`${fechaAgenda}T12:00:00`);
    fecha.setDate(fecha.getDate() + cantidad);
    const nuevaFecha = fechaComoClave(fecha);
    setFechaAgenda(nuevaFecha);
    setFormularioReserva((actual) => ({ ...actual, fecha: nuevaFecha, mesa: '' }));
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
  const inicioAgenda = turnoAgenda === 'Almuerzo' ? 12 * 60 : 18 * 60;
  const finAgenda = turnoAgenda === 'Almuerzo' ? 18 * 60 : 24 * 60;
  const reservasDelDia = reservas
    .filter((reserva) => reserva.fecha === fechaAgenda && reserva.estado !== 'Cancelada')
    .filter((reserva) => zonaAgenda === 'Todas las zonas' || mesas.find((mesa) => String(mesa.numero) === String(reserva.mesa))?.zona === zonaAgenda)
    .sort((a, b) => minutosDeHora(a.turno) - minutosDeHora(b.turno));
  const reservasVisibles = reservasDelDia.filter((reserva) => minutosDeHora(reserva.turno) >= inicioAgenda && minutosDeHora(reserva.turno) < finAgenda);
  const horaActual = minutosDeHora(new Date().toTimeString().slice(0, 5));
  const mostrarMarcaActual = fechaAgenda === hoy && horaActual >= inicioAgenda && horaActual < finAgenda;
  const posicionMarcaActual = ((horaActual - inicioAgenda) / (finAgenda - inicioAgenda)) * 100;
  const llegadasProximas = reservasVisibles.filter((reserva) => fechaAgenda > hoy || (fechaAgenda === hoy && minutosDeHora(reserva.turno) >= horaActual)).slice(0, 5);
  const reservasAtrasadas = reservasDelDia.filter((reserva) => reserva.fecha === hoy
    && minutosDeHora(reserva.turno) + Number(reserva.duracion || 105) <= horaActual
    && !['cancelada', 'terminada'].includes(String(reserva.estado || '').toLowerCase())
    && !reserva.alertaAvisada);
  const estadoMesaEnHorario = (mesa) => {
    if (!mesa.habilitada) return 'Fuera de servicio';
    const reservaActual = reservas.find((reserva) => {
      if (reserva.fecha !== fechaAgenda || String(reserva.mesa) !== String(mesa.numero) || String(reserva.estado || '').toLowerCase() === 'cancelada') return false;
      const inicio = minutosDeHora(reserva.turno);
      return inicio <= horaActual && inicio + Number(reserva.duracion || 105) > horaActual;
    });
    if (!reservaActual) return 'Libre';
    return String(reservaActual.estado || '').toLowerCase() === 'por cobrar' ? 'Por cobrar' : 'Ocupada';
  };
  const mesasDisponibles = obtenerMesasDisponibles({
    mesas,
    reservas,
    fecha: formularioReserva.fecha,
    turno: formularioReserva.turno,
    personas: formularioReserva.personas,
    duracion: formularioReserva.duracion,
  });

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

        {pestana === 'mesas' ? (
          <div className="reservas-agenda-layout">
            <section className="reservas-agenda-main">
              <div className="reservas-agenda-toolbar">
                <div className="reservas-agenda-date-controls">
                  <button type="button" className="reservas-calendar-toggle" onClick={() => setCalendarioAbierto((abierto) => !abierto)} aria-expanded={calendarioAbierto}>Calendario</button>
                  {calendarioAbierto && <input aria-label="Elegir fecha de reservas" type="date" value={fechaAgenda} onChange={(event) => { setFechaAgenda(event.target.value); setFormularioReserva((actual) => ({ ...actual, fecha: event.target.value, mesa: '' })); }} />}
                  <button type="button" className="reservas-date-arrow" aria-label="Día anterior" onClick={() => cambiarDiaAgenda(-1)}>‹</button>
                  <strong>{new Date(`${fechaAgenda}T12:00:00`).toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                  <button type="button" className="reservas-date-arrow" aria-label="Día siguiente" onClick={() => cambiarDiaAgenda(1)}>›</button>
                  <button type="button" className="reservas-today-button" onClick={() => { setFechaAgenda(hoy); setFormularioReserva((actual) => ({ ...actual, fecha: hoy, mesa: '' })); }}>Hoy</button>
                  <select aria-label="Filtrar por zona" value={zonaAgenda} onChange={(event) => setZonaAgenda(event.target.value)}>
                    <option>Todas las zonas</option>
                    {[...new Set(mesas.map((mesa) => mesa.zona))].map((zona) => <option key={zona}>{zona}</option>)}
                  </select>
                </div>
                <div className="reservas-agenda-actions">
                  <div className="reservas-shift-toggle" aria-label="Turno de reservas">
                    {['Almuerzo', 'Cena'].map((turno) => <button type="button" key={turno} className={turnoAgenda === turno ? 'active' : ''} aria-pressed={turnoAgenda === turno} onClick={() => setTurnoAgenda(turno)}>{turno}</button>)}
                  </div>
                  <button type="button" className="reservas-primary-button" onClick={() => {
                    setNuevaReservaAbierta(true);
                    setFormularioReserva((actual) => ({ ...actual, fecha: fechaAgenda, nombre: '', telefono: '', mesa: '' }));
                    setErrorReservaAgenda('');
                    setMensaje('');
                  }}>+ Nueva reserva</button>
                </div>
              </div>

              <div className="reservas-agenda-legend" aria-label="Estados de reservas">
                <span className="agenda-status-confirmada">Confirmada</span><span className="agenda-status-sentada">Sentado</span><span className="agenda-status-pendiente">Pendiente</span><span className="agenda-status-cobrar">Por cobrar</span><span className="agenda-status-cancelada">Terminada</span><span className="agenda-status-fuera">Fuera de servicio</span>
              </div>

              <div className="reservas-timeline-scroll">
                <div className="reservas-timeline">
                  <div className="reservas-timeline-header">
                    <span />
                    <div className="reservas-timeline-hours">{Array.from({ length: 6 }, (_, index) => <span key={index}>{String(Math.floor(inicioAgenda / 60) + index).padStart(2, '0')}:00</span>)}</div>
                  </div>
                  {mesas.map((mesa, index) => {
                    const reservasMesa = reservasVisibles.filter((reserva) => String(reserva.mesa) === String(mesa.numero));
                    return (
                      <div className={`reservas-timeline-row${!mesa.habilitada ? ' is-disabled' : ''}`} key={mesa.id}>
                        <div className="reservas-timeline-table-label"><strong>Mesa {mesa.numero}</strong><small>{mesa.capacidad} pers. · {mesa.zona}</small></div>
                        <div className="reservas-timeline-track">
                          {mostrarMarcaActual && <span className="reservas-timeline-now" style={{ left: `${posicionMarcaActual}%` }}>{index === 0 && <small>{new Date().toTimeString().slice(0, 5)}</small>}</span>}
                          {!mesa.habilitada && <span className="reservas-timeline-disabled-label">Fuera de servicio</span>}
                          {reservasMesa.map((reserva) => {
                            const minutos = minutosDeHora(reserva.turno);
                            const inicioBloque = Math.max(minutos, inicioAgenda);
                            const finBloque = Math.min(minutos + Number(reserva.duracion || 105), finAgenda);
                            const left = ((inicioBloque - inicioAgenda) / (finAgenda - inicioAgenda)) * 100;
                            const width = ((finBloque - inicioBloque) / (finAgenda - inicioAgenda)) * 100;
                            return <div key={reserva.id} className={`reservas-timeline-booking status-${String(reserva.estado || 'Confirmada').toLowerCase().replaceAll(' ', '-')}`} style={{ left: `${left}%`, width: `${width}%` }} title={`${reserva.nombre || 'Reserva'} · ${reserva.personas || '—'} personas · ${reserva.turno}`}>
                              <strong>{reserva.nombre || 'Reserva'}</strong><small>{reserva.personas || '—'} pers. · {reserva.turno} · Mesa {mesa.numero}</small>
                            </div>;
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {reservasVisibles.length === 0 && <p className="reservas-timeline-empty">No hay reservas para este turno y fecha.</p>}
                  <div className="reservas-timeline-caption">Agenda del turno · Las reservas se guardan en este dispositivo.</div>
                </div>
              </div>
            </section>

            <aside className="reservas-agenda-sidebar">
              <section className={`reservas-panel reservas-delay-panel${reservasAtrasadas.length ? ' has-delay' : ''}`}>
                <h3>{reservasAtrasadas.length ? `Alerta: ${reservasAtrasadas[0].nombre || 'Reserva'} pasada de hora` : 'Sin alertas de demora'}</h3>
                <p>{reservasAtrasadas.length ? `Mesa ${reservasAtrasadas[0].mesa || 'sin asignar'} · ${reservasAtrasadas[0].turno} · ${reservasAtrasadas[0].personas || '—'} personas` : 'Las reservas de hoy están al día.'}</p>
                {reservasAtrasadas.length > 0 && <button type="button" onClick={() => actualizarReserva(reservasAtrasadas[0].id, 'alertaAvisada', true)}>Marcar aviso realizado</button>}
              </section>

              {nuevaReservaAbierta && (
                <section className="reservas-panel reservas-new-booking-panel">
                  <h3>Nueva reserva</h3>
                  <form className="reservas-new-booking-form" onSubmit={guardarNuevaReserva}>
                    <label>Fecha<input name="fecha" type="date" value={formularioReserva.fecha} onChange={cambiarCampoNuevaReserva} required /></label>
                    <div className="reservas-booking-fields-row">
                      <label>Hora<input name="turno" type="time" step="900" value={formularioReserva.turno} onChange={cambiarCampoNuevaReserva} required /></label>
                      <label>Personas<input name="personas" type="number" min="1" max="30" value={formularioReserva.personas} onChange={cambiarCampoNuevaReserva} required /></label>
                    </div>
                    <label>Duración (minutos)<input name="duracion" type="number" min="30" max="360" step="15" value={formularioReserva.duracion} onChange={cambiarCampoNuevaReserva} required /></label>
                    <label>Nombre del cliente<input name="nombre" value={formularioReserva.nombre} onChange={cambiarCampoNuevaReserva} placeholder="Nombre del cliente" required /></label>
                    <label>Teléfono<input name="telefono" type="tel" value={formularioReserva.telefono} onChange={cambiarCampoNuevaReserva} placeholder="Teléfono de contacto" /></label>
                    <div className="reservas-available-tables">
                      <span>Mesas disponibles · capacidad suficiente</span>
                      {mesasDisponibles.length ? mesasDisponibles.slice(0, 4).map((mesa) => <button type="button" key={mesa.id} className={String(formularioReserva.mesa) === String(mesa.numero) ? 'selected' : ''} aria-pressed={String(formularioReserva.mesa) === String(mesa.numero)} onClick={() => setFormularioReserva((actual) => ({ ...actual, mesa: mesa.numero }))}>Mesa {mesa.numero} · {mesa.capacidad}p</button>) : <small>No hay mesas disponibles para esos datos.</small>}
                    </div>
                    <button type="button" className="reservas-search-table-button" onClick={() => {
                      if (mesasDisponibles.length) {
                        setFormularioReserva((actual) => ({ ...actual, mesa: mesasDisponibles[0].numero }));
                        setErrorReservaAgenda('');
                      } else {
                        setErrorReservaAgenda('No hay mesas disponibles para esos datos.');
                      }
                    }}>Buscar mesa libre</button>
                    {errorReservaAgenda && <p className="reservas-form-error" role="alert">{errorReservaAgenda}</p>}
                    {mensaje && <p className="reservas-success" role="status">{mensaje}</p>}
                    <div className="reservas-booking-form-actions">
                      <button type="button" className="reservas-cancel-button" onClick={() => { setNuevaReservaAbierta(false); setErrorReservaAgenda(''); }}>Cancelar</button>
                      <button type="submit" className="reservas-primary-button">Confirmar reserva</button>
                    </div>
                  </form>
                </section>
              )}

              <section className="reservas-panel reservas-arrivals-panel">
                <div className="reservas-panel-heading"><h3>Próximas llegadas</h3><span>{llegadasProximas.length}</span></div>
                {llegadasProximas.length ? llegadasProximas.map((reserva) => <article className="reservas-arrival-item" key={reserva.id}><i className={`arrival-dot status-${String(reserva.estado || 'Confirmada').toLowerCase()}`} /><div><strong>{reserva.nombre || 'Reserva'}</strong><small>{reserva.turno} · Mesa {reserva.mesa || 'por asignar'} · {reserva.personas || '—'} pers.</small></div></article>) : <p className="reservas-empty">No hay llegadas próximas para esta fecha.</p>}
              </section>
            </aside>
          </div>
        ) : pestana === 'gestion' ? (
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
                      (() => {
                        const estado = estadoMesaEnHorario(mesa);
                        return <button
                          type="button"
                          key={mesa.id}
                          className={`reservas-table-tile status-${estado.toLowerCase().replaceAll(' ', '-')}${mesaSeleccionada === mesa.id ? ' selected' : ''}`}
                          onClick={() => setMesaSeleccionada(mesa.id)}
                          aria-pressed={mesaSeleccionada === mesa.id}
                        >
                          <strong>{mesa.numero}</strong>
                          <span>{estado}</span>
                          {estado === 'Fuera de servicio' && mesa.motivo && <small>{mesa.motivo}</small>}
                        </button>;
                      })()
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