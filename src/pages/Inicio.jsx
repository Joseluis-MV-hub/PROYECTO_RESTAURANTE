import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Inicio() {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState('2026-10-27');
  const [hora, setHora] = useState('20:30');
  const [comensales, setComensales] = useState('4');

  const handleBuscar = (e) => {
    e.preventDefault();
    navigate(`/reservas?fecha=${fecha}&hora=${hora}&personas=${comensales}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <section className="hero-section">
          <img
            src="https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=400&q=80"
            alt="Ceviche MPP"
            className="hero-dish-left"
          />
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80"
            alt="Anticuchos MPP"
            className="hero-dish-right"
          />
          <h1 className="hero-title">Bienvenido a<br />Mi Propiedad Privada</h1>
          <p className="hero-subtitle">El sabor de compartir buenos momentos</p>

          <div className="quick-reserve-box">
            <h4>Reserva Rápida en Tiempo Real</h4>
            <form onSubmit={handleBuscar} className="quick-reserve-grid">
              <div className="form-group-custom">
                <label>Fecha</label>
                <input type="date" className="form-control-dark" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
              </div>
              <div className="form-group-custom">
                <label>Hora / Turno</label>
                <select className="form-control-dark" value={hora} onChange={(e) => setHora(e.target.value)}>
                  <option value="13:00">13:00 pm (Almuerzo)</option>
                  <option value="14:30">14:30 pm (Almuerzo)</option>
                  <option value="19:00">19:00 pm (Cena)</option>
                  <option value="20:30">20:30 pm (Cena)</option>
                  <option value="22:00">22:00 pm (Cena)</option>
                </select>
              </div>
              <div className="form-group-custom">
                <label>Nº de Comensales</label>
                <select className="form-control-dark" value={comensales} onChange={(e) => setComensales(e.target.value)}>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="4">4 personas</option>
                  <option value="6">6 personas</option>
                  <option value="8">8 a más personas</option>
                </select>
              </div>
              <button type="submit" className="btn-gold" style={{ height: '36px' }}>Buscar Disponibilidad</button>
            </form>
            <div className="quick-reserve-alert">
              <span style={{ color: '#14110b', fontSize: '14px' }}>●</span>
              <span>Mesas disponibles en tiempo real - Evita colas y duplicaciones</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="section-title">Conoce nuestra</h2>
          <div className="cards-grid-4">
            {[
              { to: '/carta', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80', title: 'Nuestra Carta' },
              { to: '/galeria', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80', title: 'Nuestros Ambientes' },
              { to: '/nosotros', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=500&q=80', title: 'Eventos Especiales' },
              { to: '/ubicacion', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=80', title: 'Visítanos' },
            ].map((c) => (
              <Link to={c.to} key={c.title} className="mpp-card">
                <img src={c.img} alt={c.title} className="mpp-card-img" />
                <div className="mpp-card-body">
                  <h5>{c.title}</h5>
                  <p>Descubre lo mejor de Mi Propiedad Privada.</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="benefits-section">
          <div className="benefits-box">
            <h4>Beneficios de Reservar Online</h4>
            <div className="benefits-grid">
              <div className="benefit-item"><h6>Confirmación Inmediata</h6><p>Recibe tu reserva confirmada sin esperas ni llamadas telefónicas.</p></div>
              <div className="benefit-item"><h6>Cero Esperas Telefónicas</h6><p>Elige horario y comensales con disponibilidad actualizada al segundo.</p></div>
              <div className="benefit-item"><h6>Menú Digital</h6><p>Consulta la carta y elige qué disfrutar antes de tu llegada al salón.</p></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
