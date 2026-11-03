import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HISTORIA = [
  { id: 1, anio: "2015", titulo: "Nuestra Fundación", desc: "Abrimos nuestras puertas con 6 mesas y la visión de fusionar tradición y vanguardia.", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80" },
  { id: 2, anio: "2018", titulo: "Reconocimiento Culinario", desc: "Galardonados como mejor propuesta gastronómica emergente de la ciudad.", img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80" },
  { id: 3, anio: "2021", titulo: "Ampliación de Ambientes", desc: "Inauguración de nuestra exclusiva cava subterránea y salón para eventos privados.", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" },
  { id: 4, anio: "2024", titulo: "Segunda Sede", desc: "Apertura de la sede San Isidro con una arquitectura de primer nivel.", img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80" },
];

export default function Nosotros() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: '1200px', margin: '40px auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>

        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
          <div>
            <h1 style={{ fontSize: '36px', color: '#fff', marginBottom: '20px' }}>Sobre Nosotros</h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '15px', marginBottom: '20px' }}>
              En <strong>Mi Propiedad Privada</strong> convertimos nuestra pasión por la buena comida y la calidez del servicio en momentos inolvidables.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '15px', marginBottom: '30px' }}>
              Un lugar para disfrutar en familia o celebrar con amigos, combinando ingredientes peruanos selectos, técnicas de alta cocina y un ambiente distinguido.
            </p>
            <Link to="/carta" className="btn-gold">Ver nuestra Carta</Link>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
              alt="Ambiente MPP"
              style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-gold)' }}
            />
          </div>
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '25px', textAlign: 'center' }}>Nuestra Historia</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            {HISTORIA.map((h) => (
              <div key={h.id} className="mpp-card">
                <img src={h.img} alt={h.titulo} className="mpp-card-img" />
                <div className="mpp-card-body">
                  <span style={{ color: 'var(--gold-secondary)', fontWeight: 'bold', fontSize: '12px' }}>{h.anio}</span>
                  <h5 style={{ margin: '4px 0 6px' }}>{h.titulo}</h5>
                  <p>{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '35px 30px', textAlign: 'center', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '24px', color: '#fff', marginBottom: '10px' }}>¿Listos para vivir la experiencia?</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '22px' }}>Reserva tu mesa en menos de 2 minutos y asegura tu lugar con nosotros.</p>
          <Link to="/reservas" className="btn-gold" style={{ padding: '12px 30px', fontSize: '15px' }}>Reservar Mesa Ahora</Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
