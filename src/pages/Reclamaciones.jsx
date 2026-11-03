import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { phoneCountryCodes } from '../data/phoneCountries';

const countryNames = typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames(['es'], { type: 'region' })
  : null;
const countries = phoneCountryCodes
  .map(([code, callingCode]) => ({
    code,
    name: countryNames?.of(code) || code,
    callingCode,
  }))
  .sort((first, second) => first.name.localeCompare(second.name, 'es'));

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split('T')[0];
};

const createInitialForm = () => ({
  codigoCliente: '', tipoDoc: 'DNI', dni: '', nombre: '', telefonoPais: 'PE', telefono: '', correo: '',
  sede: 'Miraflores', fecha: today(), mesaComanda: '', monto: '',
  asunto: '', detalle: '', peticion: '', acepta: false,
});

export default function Reclamaciones() {
  const [tipo, setTipo] = useState('Reclamo');
  const [enviado, setEnviado] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(createInitialForm);
  const phoneInput = useRef(null);
  const selectedCountry = countries.find((country) => country.code === form.telefonoPais);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = name === 'telefono'
      ? value.replace(/[^\d\s()+.-]/g, '').slice(0, 20)
      : name === 'codigoCliente' ? value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20)
      : type === 'checkbox' ? checked : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
    if (name === 'telefono' || name === 'telefonoPais') {
      phoneInput.current?.setCustomValidity('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const phoneDigits = form.telefono.replace(/\D/g, '');
    if (form.telefono && (phoneDigits.length < 6 || phoneDigits.length > 15)) {
      phoneInput.current?.setCustomValidity('Ingresa un número válido de 6 a 15 dígitos para el país seleccionado.');
      phoneInput.current?.reportValidity();
      return;
    }

    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    const previos = JSON.parse(localStorage.getItem('mpp_reclamaciones') || '[]');
    const codigo = `REC-${new Date().getFullYear()}-${String(previos.length + 1).padStart(3, '0')}`;
    const nuevo = {
      id: Date.now(), codigo, tipo,
      fecha: new Date().toLocaleString('es-PE', { hour12: false }),
      nombre: form.nombre,
      codigoCliente: form.codigoCliente,
      dni: `${form.tipoDoc}: ${form.dni}`,
      telefono: form.telefono ? `+${selectedCountry.callingCode} ${form.telefono}` : 'No especificado',
      correo: form.correo,
      sede: form.sede,
      asunto: form.asunto,
      detalle: form.detalle,
      peticion: form.peticion || 'Revisión y mejora del servicio.',
      mesa: form.mesaComanda || 'No especificada',
      monto: form.monto ? `S/ ${parseFloat(form.monto).toFixed(2)}` : 'N/A',
      estado: 'Pendiente'
    };
    localStorage.setItem('mpp_reclamaciones', JSON.stringify([nuevo, ...previos]));
    setEnviado(nuevo);
    setStep(4);
  };

  const resetForm = () => {
    setEnviado(null);
    setStep(1);
    setTipo('Reclamo');
    setForm(createInitialForm());
  };

  const steps = ['Tus datos', 'Reclamación', 'Revisión', 'Confirmación'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="complaint-page">
        <header className="complaint-heading">
          <h1>Libro de Reclamaciones</h1>
          <p>Cuéntanos lo ocurrido. Completa el formulario en etapas y revisa tu solicitud antes de finalizar.</p>
        </header>

        <section className="complaint-card" aria-label="Formulario del libro de reclamaciones">
          <div className="complaint-progress-wrap">
            <span className="complaint-progress-label">Tu solicitud</span>
            <nav className="complaint-progress" aria-label="Progreso del formulario">
              {steps.map((label, index) => {
                const number = index + 1;
                const complete = step > number;
                const active = step === number;
                return (
                  <button
                    className={`complaint-progress-step${active ? ' active' : ''}${complete ? ' complete' : ''}`}
                    key={label}
                    type="button"
                    disabled={number >= step || step === 4}
                    onClick={() => setStep(number)}
                    aria-current={active ? 'step' : undefined}
                  >
                    <span className="complaint-step-number">{complete ? '✓' : number}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {step === 4 && enviado ? (
            <div className="complaint-confirmation">
              <div className="complaint-success-mark" aria-hidden="true">✓</div>
              <p className="complaint-eyebrow">Confirmación de demostración</p>
              <h2>¡Tu solicitud está lista!</h2>
              <p className="complaint-intro">Aquí verás la constancia final de tu solicitud. Conserva el código de referencia para consultarla.</p>
              <div className="complaint-reference">
                <span className="complaint-reference-label">Código de referencia</span>
                <strong>{enviado.codigo}</strong>
                <div className="complaint-summary-grid">
                  <div><span>Tipo de solicitud</span><strong>{enviado.tipo}</strong></div>
                  <div><span>Fecha de presentación</span><strong>{enviado.fecha}</strong></div>
                  <div><span>Cliente</span><strong>{enviado.nombre}</strong></div>
                  <div><span>Correo de contacto</span><strong>{enviado.correo}</strong></div>
                </div>
                <p className="complaint-demo-note">Prototipo visual: la solicitud se guarda en este navegador y no se envía a un sistema externo.</p>
              </div>
              <div className="complaint-next-steps">
                <h3>Ten en cuenta</h3>
                <p>Guarda el código de referencia y verifica que tus datos de contacto estén escritos correctamente.</p>
              </div>
              <div className="complaint-actions centered">
                <button className="btn-outline-gold" type="button" onClick={() => window.print()}>Descargar constancia</button>
                <a className="btn-gold" href="/">Volver al inicio</a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate={false}>
              {step === 1 && (
                <section className="complaint-form-step">
                  <h2>Identificación del cliente</h2>
                  <p className="complaint-step-description">Ingresa tu código de cliente y tus datos de contacto.</p>
                  <div className="form-grid-2 complaint-fields">
                    <div className="form-group-custom">
                      <label htmlFor="codigoCliente">Código de cliente <span>*</span></label>
                      <input id="codigoCliente" name="codigoCliente" className="form-control-dark" value={form.codigoCliente} onChange={handleChange} placeholder="Ej. MPP-MS-0028" autoComplete="off" required maxLength="20" pattern="(?:MPP-[A-Z0-9]{2,6}-[0-9]{4,8}|CL-[0-9]{4,8})" title="Usa el formato MPP-MS-0028 o CL-20481." />
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="tipoDoc">Tipo de documento <span>*</span></label>
                      <select id="tipoDoc" name="tipoDoc" className="form-control-dark" value={form.tipoDoc} onChange={handleChange} required>
                        <option value="DNI">DNI</option>
                        <option value="C.E.">Carnet de extranjería</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="RUC">RUC</option>
                      </select>
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="dni">Número de documento <span>*</span></label>
                      <input id="dni" name="dni" className="form-control-dark" value={form.dni} onChange={handleChange} placeholder="Ej. 74859612" autoComplete="off" required minLength="5" maxLength="20" pattern="[A-Za-z0-9 -]+" title="Usa entre 5 y 20 letras o números." />
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="nombre">Nombre completo <span>*</span></label>
                      <input id="nombre" name="nombre" className="form-control-dark" value={form.nombre} onChange={handleChange} placeholder="Como aparece en tu documento" autoComplete="name" required minLength="3" maxLength="100" pattern="[A-Za-zÀ-ÿ' -]+" title="Ingresa un nombre válido, sin números ni símbolos." />
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="correo">Correo electrónico <span>*</span></label>
                      <input id="correo" name="correo" type="email" className="form-control-dark" value={form.correo} onChange={handleChange} placeholder="nombre@correo.com" autoComplete="email" required maxLength="150" />
                    </div>
                    <div className="form-group-custom phone-field">
                      <label htmlFor="telefonoPais">Teléfono <small>(opcional)</small></label>
                      <div className="phone-input-row">
                        <select id="telefonoPais" name="telefonoPais" className="form-control-dark phone-country" value={form.telefonoPais} onChange={handleChange} aria-label="País del teléfono">
                          {countries.map((country) => <option key={country.code} value={country.code}>{country.name} (+{country.callingCode})</option>)}
                        </select>
                        <input ref={phoneInput} name="telefono" type="tel" className="form-control-dark" value={form.telefono} onChange={handleChange} placeholder="Número de contacto" autoComplete="tel-national" inputMode="tel" maxLength="20" aria-label="Número de teléfono" />
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="complaint-form-step">
                  <h2>Cuéntanos lo ocurrido</h2>
                  <p className="complaint-step-description">Selecciona el tipo de solicitud y describe el producto o servicio relacionado.</p>
                  <fieldset className="complaint-type-fieldset">
                    <legend>Tipo de solicitud <span>*</span></legend>
                    <div className="complaint-type-options">
                      {[
                        { id: 'Reclamo', desc: 'Disconformidad con un producto o servicio' },
                        { id: 'Queja', desc: 'Disconformidad con la atención recibida' },
                        { id: 'Sugerencia', desc: 'Una idea para ayudarnos a mejorar' },
                      ].map((item) => (
                        <label className={`complaint-type-option${tipo === item.id ? ' selected' : ''}`} key={item.id}>
                          <input type="radio" name="tipoSolicitud" value={item.id} checked={tipo === item.id} onChange={() => setTipo(item.id)} />
                          <span><strong>{item.id}</strong><small>{item.desc}</small></span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="form-grid-2 complaint-fields">
                    <div className="form-group-custom">
                      <label htmlFor="asunto">Producto o servicio <span>*</span></label>
                      <input id="asunto" name="asunto" className="form-control-dark" value={form.asunto} onChange={handleChange} placeholder="¿Sobre qué trata tu solicitud?" required minLength="3" maxLength="100" />
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="fecha">Fecha del suceso <span>*</span></label>
                      <input id="fecha" name="fecha" type="date" className="form-control-dark" value={form.fecha} onChange={handleChange} max={today()} required />
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="sede">Sede involucrada <span>*</span></label>
                      <select id="sede" name="sede" className="form-control-dark" value={form.sede} onChange={handleChange} required>
                        <option value="Miraflores">Sede Miraflores</option>
                        <option value="San Isidro">Sede San Isidro</option>
                        <option value="Delivery">Canal delivery</option>
                      </select>
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="mesaComanda">Mesa o número de comanda <small>(opcional)</small></label>
                      <input id="mesaComanda" name="mesaComanda" className="form-control-dark" value={form.mesaComanda} onChange={handleChange} placeholder="Ej. Mesa 04 o B001-245" maxLength="30" />
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="monto">Monto reclamado en S/ <small>(opcional)</small></label>
                      <input id="monto" name="monto" type="number" min="0" max="1000000" step="0.01" className="form-control-dark" value={form.monto} onChange={handleChange} placeholder="Ej. 45.00" />
                    </div>
                    <div className="form-group-custom">
                      <label htmlFor="peticion">Solución que esperas <small>(opcional)</small></label>
                      <input id="peticion" name="peticion" className="form-control-dark" value={form.peticion} onChange={handleChange} placeholder="¿Cómo podemos ayudarte?" maxLength="250" />
                    </div>
                  </div>
                  <div className="form-group-custom complaint-detail-field">
                    <label htmlFor="detalle">Detalle de la reclamación <span>*</span></label>
                    <textarea id="detalle" name="detalle" rows="5" className="form-control-dark" value={form.detalle} onChange={handleChange} placeholder="Describe lo sucedido con el mayor detalle posible..." required minLength="20" maxLength="2000" />
                    <small className="complaint-character-count">{form.detalle.length}/2000 caracteres (mínimo 20)</small>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="complaint-form-step">
                  <h2>Revisa tu solicitud</h2>
                  <p className="complaint-step-description">Confirma que la información esté correcta antes de finalizar.</p>
                  <div className="complaint-review-grid">
                    <div><strong>Cliente</strong><span>{form.nombre}</span></div>
                    <div><strong>Código de cliente</strong><span>{form.codigoCliente}</span></div>
                    <div><strong>Documento</strong><span>{form.tipoDoc}: {form.dni}</span></div>
                    <div><strong>Contacto</strong><span>{form.correo}{form.telefono ? ` · +${selectedCountry.callingCode} ${form.telefono}` : ''}</span></div>
                    <div><strong>Tipo de solicitud</strong><span>{tipo}</span></div>
                    <div><strong>Producto o servicio</strong><span>{form.asunto} · {form.fecha}</span></div>
                    <div className="wide"><strong>Detalle</strong><span>{form.detalle}</span></div>
                  </div>
                  <label className="complaint-consent">
                    <input type="checkbox" name="acepta" checked={form.acepta} onChange={handleChange} required />
                    <span>Confirmo que la información proporcionada es correcta y autorizo su uso para atender esta solicitud.</span>
                  </label>
                </section>
              )}

              <div className="complaint-actions">
                <button className="btn-outline-gold" type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>‹ &nbsp; Atrás</button>
                <button className="btn-gold" type="submit">{step === 3 ? 'Enviar solicitud' : 'Continuar'} &nbsp; ›</button>
              </div>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
