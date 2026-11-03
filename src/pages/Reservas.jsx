import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Check, Clock3, CreditCard, Download, Landmark, LockKeyhole, ShieldCheck, Smartphone, Wallet } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { leerMesasAdministrativas, leerReservas, obtenerMesasDisponibles } from '../data/reservas';
import '../styles/Reservas.css';

const METODOS_PAGO = [
  { id: 'Tarjeta', icon: CreditCard, detail: 'Pago con tarjeta en pasarela de demostración.' },
  { id: 'Yape', icon: Smartphone, detail: 'Se confirmará una operación de prueba con Yape.' },
  { id: 'Plin', icon: Smartphone, detail: 'Se confirmará una operación de prueba con Plin.' },
  { id: 'Transferencia', icon: Landmark, detail: 'Se registrará una transferencia de prueba.' },
  { id: 'PagoEfectivo', icon: Wallet, detail: 'Se generará un pago en efectivo de demostración.' },
];

const leerLista = (clave) => {
  try {
    const valor = JSON.parse(localStorage.getItem(clave) || '[]');
    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
};

const fechaLocal = (fecha) => `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
const fechaLarga = (fecha) => new Date(`${fecha}T12:00:00`).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const montoGarantia = (personas) => Number(personas) * 20;

export default function Reservas() {
  const [searchParams] = useSearchParams();
  const fechaActual = fechaLocal(new Date());
  const [form, setForm] = useState({
    dni: '', nombre: '', correo: '', telefono: '',
    sede: 'Miraflores',
    fecha: searchParams.get('fecha') || fechaActual,
    turno: searchParams.get('hora') || '20:30',
    personas: searchParams.get('personas') || '4',
    comentarios: ''
  });
  const [paso, setPaso] = useState(1);
  const [metodoPago, setMetodoPago] = useState('Tarjeta');
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(null);
  const [errorReserva, setErrorReserva] = useState('');
  const [segundosRestantes, setSegundosRestantes] = useState(600);
  const [fechaRetencion, setFechaRetencion] = useState(null);
  const [mesaSugerida, setMesaSugerida] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');
  const [mesasAdmin, setMesasAdmin] = useState(leerMesasAdministrativas);
  const [reservasExistentes, setReservasExistentes] = useState(leerReservas);
  const [cierresAdmin, setCierresAdmin] = useState(() => leerLista('mpp_admin_cierres_local'));

  useEffect(() => {
    const sincronizarStorage = (event) => {
      if (!event || event.key === 'mpp_admin_mesas' || event.type === 'mpp:mesas-updated') setMesasAdmin(leerMesasAdministrativas());
      if (!event || event.key === 'mpp_reservas' || event.type === 'mpp:reservas-updated') setReservasExistentes(leerReservas());
      if (!event || event.key === 'mpp_admin_cierres_local' || event.type === 'mpp:closures-updated') setCierresAdmin(leerLista('mpp_admin_cierres_local'));
    };

    window.addEventListener('storage', sincronizarStorage);
    window.addEventListener('mpp:mesas-updated', sincronizarStorage);
    window.addEventListener('mpp:reservas-updated', sincronizarStorage);
    window.addEventListener('mpp:closures-updated', sincronizarStorage);
    return () => {
      window.removeEventListener('storage', sincronizarStorage);
      window.removeEventListener('mpp:mesas-updated', sincronizarStorage);
      window.removeEventListener('mpp:reservas-updated', sincronizarStorage);
      window.removeEventListener('mpp:closures-updated', sincronizarStorage);
    };
  }, []);

  useEffect(() => {
    if (paso !== 2 || !fechaRetencion) return undefined;

    const actualizarCuentaRegresiva = () => {
      const restantes = Math.max(0, Math.ceil((fechaRetencion - Date.now()) / 1000));
      setSegundosRestantes(restantes);
      if (restantes === 0) {
        setFechaRetencion(null);
        setPaso(1);
        setErrorReserva('La retención venció. Vuelve a elegir tu horario para continuar.');
      }
    };

    actualizarCuentaRegresiva();
    const temporizador = window.setInterval(actualizarCuentaRegresiva, 1000);
    return () => window.clearInterval(temporizador);
  }, [paso, fechaRetencion]);

  const localCerrado = cierresAdmin.some((cierre) => cierre.fecha === form.fecha && cierre.estado === 'Cerrado');
  const mesasDisponibles = localCerrado ? [] : obtenerMesasDisponibles({
    mesas: mesasAdmin,
    reservas: reservasExistentes,
    fecha: form.fecha,
    turno: form.turno,
    personas: form.personas,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validación estricta para el DNI (solo 8 números)
    if (name === 'dni') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    } 
    // Validación estricta para el Teléfono (9 números, empieza con 9)
    else if (name === 'telefono') {
      let numericValue = value.replace(/[^0-9]/g, ''); // Solo números
      numericValue = numericValue.slice(0, 9); // Máximo 9 dígitos
      
      // Si hay algún número y el primero no es 9, lo forzamos a 9
      if (numericValue.length > 0 && numericValue[0] !== '9') {
        numericValue = '9' + numericValue.substring(1);
      }
      newValue = numericValue;
    }

    setForm((actual) => ({ ...actual, [name]: newValue }));
    if (['fecha', 'turno', 'personas', 'sede'].includes(name)) setMesaSeleccionada('');
    setErrorReserva('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cierres = leerLista('mpp_admin_cierres_local');

    if (cierres.some((cierre) => cierre.fecha === form.fecha && cierre.estado === 'Cerrado')) {
      setErrorReserva('No hay disponibilidad para esa fecha. El local está cerrado; elige otro día.');
      return;
    }

    const mesas = leerMesasAdministrativas();
    const reservasActuales = leerReservas();
    const disponibles = obtenerMesasDisponibles({ mesas, reservas: reservasActuales, fecha: form.fecha, turno: form.turno, personas: form.personas });
    const mesaElegida = disponibles.find((mesa) => String(mesa.numero) === String(mesaSeleccionada))
      || (!mesaSeleccionada ? disponibles[0] : null);
    setMesasAdmin(mesas);
    setReservasExistentes(reservasActuales);
    if (!mesaElegida) {
      setMesaSeleccionada('');
      setErrorReserva('No hay una mesa disponible para esa cantidad de personas y horario. Prueba otro horario o una cantidad menor.');
      return;
    }

    setMesaSugerida(mesaElegida);
    setMesaSeleccionada(String(mesaElegida.numero));
    setSegundosRestantes(600);
    setFechaRetencion(Date.now() + 10 * 60 * 1000);
    setErrorReserva('');
    setPaso(2);
  };

  const confirmarPago = () => {
    if (!aceptaPoliticas) {
      setErrorReserva('Acepta las políticas para confirmar la garantía.');
      return;
    }

    if (segundosRestantes <= 0) {
      setPaso(1);
      setErrorReserva('La retención venció. Vuelve a elegir tu horario para continuar.');
      return;
    }

    const cierresActuales = leerLista('mpp_admin_cierres_local');
    setCierresAdmin(cierresActuales);
    if (cierresActuales.some((cierre) => cierre.fecha === form.fecha && cierre.estado === 'Cerrado')) {
      setPaso(1);
      setFechaRetencion(null);
      setMesaSugerida(null);
      setMesaSeleccionada('');
      setErrorReserva('El local cerró en esta fecha. Elige otro día para continuar.');
      return;
    }

    const mesasActuales = leerMesasAdministrativas();
    const reservasActuales = leerReservas();
    const mesasDisponiblesActuales = obtenerMesasDisponibles({
      mesas: mesasActuales,
      reservas: reservasActuales,
      fecha: form.fecha,
      turno: form.turno,
      personas: form.personas,
    });
    const mesaConfirmada = mesasDisponiblesActuales.find((mesa) => String(mesa.numero) === String(mesaSugerida?.numero));
    if (!mesaConfirmada) {
      setMesasAdmin(mesasActuales);
      setReservasExistentes(reservasActuales);
      setPaso(1);
      setFechaRetencion(null);
      setMesaSugerida(null);
      setMesaSeleccionada('');
      setErrorReserva('Esa mesa ya no está disponible. Elige una de las mesas libres para continuar.');
      return;
    }

    const id = Date.now();
    const codigo = `MPP-MS-${String(id).slice(-4).padStart(4, '0')}`;
    const nueva = {
      id,
      codigo,
      ...form,
      mesa: mesaConfirmada.numero,
      duracion: 105,
      estado: 'Confirmada',
      plataformaPago: metodoPago,
      importe: montoGarantia(form.personas),
      garantia: montoGarantia(form.personas),
      pagoEstado: 'Simulado',
      fechaRegistro: new Date().toLocaleDateString('es-PE'),
    };

    const reservas = [...reservasActuales, nueva];
    localStorage.setItem('mpp_reservas', JSON.stringify(reservas));
    window.dispatchEvent(new Event('mpp:reservas-updated'));
    setReservasExistentes(reservas);
    setReservaConfirmada(nueva);
    setFechaRetencion(null);
    setErrorReserva('');
    setPaso(3);
  };

  const volverAReservar = () => {
    setPaso(1);
    setReservaConfirmada(null);
    setAceptaPoliticas(false);
    setErrorReserva('');
    setFechaRetencion(null);
    setMesaSeleccionada('');
    setMesaSugerida(null);
    setForm({ dni: '', nombre: '', correo: '', telefono: '', sede: 'Miraflores', fecha: fechaActual, turno: '20:30', personas: '4', comentarios: '' });
  };

  const descargarComprobante = () => {
    const reserva = reservaConfirmada;
    const contenido = [
      'MI PROPIEDAD PRIVADA - COMPROBANTE DE RESERVA',
      `Código: ${reserva.codigo}`,
      `Cliente: ${reserva.nombre}`,
      `DNI: ${reserva.dni}`,
      `Sede: ${reserva.sede}`,
      `Fecha: ${fechaLarga(reserva.fecha)}`,
      `Hora: ${reserva.turno}`,
      `Personas: ${reserva.personas}`,
      `Mesa: ${reserva.mesa || 'Por asignar al llegar'}`,
      `Garantía de prueba: S/ ${Number(reserva.garantia).toFixed(2)}`,
      `Método: ${reserva.plataformaPago}`,
      'Estado del pago: Simulado, no se realizó ningún cobro real.',
    ].join('\n');
    const archivo = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `comprobante-${reserva.codigo}.txt`;
    enlace.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="booking-page">
        {paso < 3 && (
          <div className="booking-stepper" aria-label="Progreso de reserva">
            {['Reserva', 'Pago', 'Confirmación'].map((nombre, index) => {
              const numero = index + 1;
              const Icon = numero === 1 ? CalendarDays : numero === 2 ? CreditCard : Check;
              return <div className={`booking-step${paso === numero ? ' is-current' : ''}${paso > numero ? ' is-complete' : ''}`} key={nombre}>
                <span>{paso > numero ? <Check size={14} /> : numero}</span><strong>{nombre}</strong>{numero < 3 && <i />}
                <Icon className="booking-step-mobile-icon" size={14} />
              </div>;
            })}
          </div>
        )}

        {paso === 1 && (
          <section className="booking-section">
            <header className="booking-heading">
              <h1>Haz tu reserva</h1>
              <p>Reserva tu mesa y disfruta de una experiencia gastronómica única.</p>
            </header>
            <form className="booking-card booking-form" onSubmit={handleSubmit}>
              <div className="booking-form-grid">
                
                <label>
                  DNI / Documento
                  <input 
                    type="text" 
                    name="dni" 
                    value={form.dni} 
                    onChange={handleChange} 
                    autoComplete="off" 
                    placeholder="Tu DNI" 
                    required 
                    maxLength={8}
                    pattern="[0-9]{8}"
                    inputMode="numeric"
                    title="Debe ingresar exactamente 8 números"
                  />
                </label>
                
                <label>Nombre completo<input name="nombre" value={form.nombre} onChange={handleChange} autoComplete="name" placeholder="Tu nombre y apellido" required /></label>
                <label>Correo electrónico<input type="email" name="correo" value={form.correo} onChange={handleChange} autoComplete="email" placeholder="Tu correo" required /></label>
                
                <label>
                  Teléfono
                  <input 
                    type="tel" 
                    name="telefono" 
                    value={form.telefono} 
                    onChange={handleChange} 
                    autoComplete="tel" 
                    placeholder="Tu teléfono" 
                    required 
                    maxLength={9}
                    pattern="9[0-9]{8}"
                    inputMode="numeric"
                    title="Debe empezar con 9 y tener 9 números en total"
                  />
                </label>
                
                <label>Sede<select name="sede" value={form.sede} onChange={handleChange}><option value="Miraflores">Miraflores</option><option value="San Isidro">San Isidro</option></select></label>
                <label>Fecha<input type="date" name="fecha" value={form.fecha} onChange={handleChange} min={fechaActual} required /></label>
                <label>Hora<select name="turno" value={form.turno} onChange={handleChange} required><option value="13:00">13:00 · Almuerzo</option><option value="14:30">14:30 · Almuerzo</option><option value="19:00">19:00 · Cena</option><option value="20:00">20:00 · Cena</option><option value="20:30">20:30 · Cena</option><option value="22:00">22:00 · Cena</option></select></label>
                <label>Número de personas<select name="personas" value={form.personas} onChange={handleChange} required><option value="1">1 persona</option><option value="2">2 personas</option><option value="4">4 personas</option><option value="6">6 personas</option><option value="8">8 personas</option></select></label>
                <div className="booking-table-availability" aria-live="polite">
                  <div className="booking-table-availability-heading"><strong>Mesas disponibles</strong><span>{mesasDisponibles.length}</span></div>
                  {localCerrado ? (
                    <p className="booking-table-empty">El local está cerrado en esta fecha.</p>
                  ) : mesasDisponibles.length > 0 ? (
                    <div className="booking-table-options">
                      {mesasDisponibles.map((mesa) => <button type="button" className={`booking-table-option${String(mesaSeleccionada) === String(mesa.numero) ? ' is-selected' : ''}`} key={mesa.id} aria-pressed={String(mesaSeleccionada) === String(mesa.numero)} onClick={() => { setMesaSeleccionada(String(mesa.numero)); setErrorReserva(''); }}>
                        <strong>Mesa {mesa.numero}</strong><span>{mesa.capacidad} {Number(mesa.capacidad) === 1 ? 'persona' : 'personas'} · {mesa.zona}</span>
                      </button>)}
                    </div>
                  ) : (
                    <p className="booking-table-empty">No hay mesas libres para esta fecha, hora y cantidad de personas. Prueba otro horario.</p>
                  )}
                </div>
                <label className="booking-notes-field">Comentarios<textarea name="comentarios" rows="3" value={form.comentarios} onChange={handleChange} placeholder="¿Alguna petición especial?" /></label>
              </div>
              {errorReserva && <p className="booking-error" role="alert">{errorReserva}</p>}
              <button className="booking-primary-button" type="submit">Continuar con la reserva</button>
            </form>
          </section>
        )}

        {paso === 2 && (
          <section className="booking-section booking-payment-section">
            <header className="booking-heading">
              <h1>Confirma tu reserva</h1>
              <p>Elige el método para registrar la garantía de tu mesa.</p>
            </header>
            <div className="booking-checkout-layout">
              <div className="booking-payment-column">
                <div className="booking-hold-notice"><Clock3 size={15} /><span>Reserva retenida por <strong>{String(Math.floor(segundosRestantes / 60)).padStart(2, '0')}:{String(segundosRestantes % 60).padStart(2, '0')}</strong></span><small>Completa la confirmación</small></div>
                <section className="booking-card booking-methods-card">
                  <div className="booking-card-heading"><div><h2>Método de pago</h2><p>Pago de demostración, no se realizará ningún cobro real.</p></div><ShieldCheck size={20} /></div>
                  <div className="booking-method-grid">
                    {METODOS_PAGO.map(({ id, icon: Icon }) => <button type="button" className={`booking-method${metodoPago === id ? ' is-selected' : ''}`} key={id} onClick={() => setMetodoPago(id)} aria-pressed={metodoPago === id}><Icon size={18} /><span>{id === 'PagoEfectivo' ? 'PagoEfectivo' : id}</span></button>)}
                  </div>
                  <div className="booking-demo-payment"><LockKeyhole size={17} /><div><strong>{METODOS_PAGO.find((metodo) => metodo.id === metodoPago)?.detail}</strong><span>Este prototipo solo registra la reserva. No solicita ni guarda datos bancarios.</span></div></div>
                  <div className="booking-payment-footnote">La garantía se calcula a S/ 20.00 por persona y se registra como simulada.</div>
                </section>
              </div>

              <aside className="booking-card booking-summary-card">
                <h2>Resumen</h2><p>Revisa los datos de tu reserva</p>
                <dl>
                  <div><dt>A nombre de</dt><dd>{form.nombre}</dd></div>
                  <div><dt>Sede</dt><dd>{form.sede}</dd></div>
                  <div><dt>Fecha</dt><dd>{fechaLarga(form.fecha)}</dd></div>
                  <div><dt>Hora</dt><dd>{form.turno}</dd></div>
                  <div><dt>Personas</dt><dd>{form.personas} {Number(form.personas) === 1 ? 'persona' : 'personas'}</dd></div>
                  {mesaSugerida && <div><dt>Mesa sugerida</dt><dd>Mesa {mesaSugerida.numero}</dd></div>}
                </dl>
                <div className="booking-total"><span>Garantía (S/ 20 × persona)</span><strong>S/ {montoGarantia(form.personas).toFixed(2)}</strong></div>
                <label className="booking-policy-check"><input type="checkbox" checked={aceptaPoliticas} onChange={(event) => { setAceptaPoliticas(event.target.checked); setErrorReserva(''); }} /><span>Acepto las políticas de privacidad y cancelación.</span></label>
                {errorReserva && <p className="booking-error" role="alert">{errorReserva}</p>}
                <button className="booking-primary-button booking-pay-button" type="button" onClick={confirmarPago}><LockKeyhole size={15} /> Confirmar garantía · S/ {montoGarantia(form.personas).toFixed(2)}</button>
                <button className="booking-back-button" type="button" onClick={() => { setPaso(1); setFechaRetencion(null); setErrorReserva(''); }}><ArrowLeft size={14} /> Volver a los datos</button>
                <small className="booking-summary-note">Operación simulada para demostración.</small>
              </aside>
            </div>
          </section>
        )}

        {paso === 3 && reservaConfirmada && (
          <section className="booking-section booking-confirmation-section">
            <div className="booking-complete-mark"><Check size={22} /></div>
            <header className="booking-heading">
              <h1>¡Reserva confirmada!</h1>
              <p>Gracias, {reservaConfirmada.nombre}. Te esperamos para compartir buenos momentos.</p>
              <p>El detalle de tu reserva está listo para guardar en el comprobante.</p>
            </header>
            <article className="booking-card booking-ticket">
              <div className="booking-ticket-top"><div><span>CÓDIGO DE RESERVA</span><strong>{reservaConfirmada.codigo}</strong></div><CalendarDays size={21} /></div>
              <dl>
                <div><dt>Sede</dt><dd>{reservaConfirmada.sede}</dd><small>{reservaConfirmada.telefono}</small></div>
                <div><dt>Fecha y hora</dt><dd>{fechaLarga(reservaConfirmada.fecha)}</dd><small>{reservaConfirmada.turno}</small></div>
                <div><dt>Personas</dt><dd>{reservaConfirmada.personas} {Number(reservaConfirmada.personas) === 1 ? 'persona' : 'personas'}</dd></div>
              </dl>
              <p className="booking-ticket-hint">Guarda este código y preséntalo al llegar.</p>
              <div className="booking-payment-status"><span><Check size={13} /> Garantía registrada</span><small>Pago simulado</small></div>
              <div className="booking-ticket-total"><span>Garantía</span><strong>S/ {Number(reservaConfirmada.garantia).toFixed(2)}</strong></div>
              <div className="booking-ticket-method"><span>Método</span><strong>{reservaConfirmada.plataformaPago}</strong></div>
            </article>
            <div className="booking-confirmation-actions">
              <button type="button" className="booking-primary-button" onClick={descargarComprobante}><Download size={15} /> Descargar comprobante</button>
              <button type="button" className="booking-secondary-button" onClick={volverAReservar}><ArrowLeft size={15} /> Hacer otra reserva</button>
            </div>
            <p className="booking-contact-note">¿Necesitas modificar tu reserva? Contáctanos al +51 997 568 990</p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}