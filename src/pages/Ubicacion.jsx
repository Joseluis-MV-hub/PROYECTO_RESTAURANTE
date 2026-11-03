import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SEDES = [
  {
    id: 1, nombre: "Ubicación 1: Sede Miraflores",
    direccion: "Av. Principal 123, Miraflores, Lima, Perú",
    telefono: "(01) 456 7890", whatsapp: "++51 983 581 736",
    descripcion: "Un ambiente cálido y elegante pensado para compartir momentos especiales. Diseño contemporáneo, servicio atento y experiencia gastronómica premium.",
    imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2, nombre: "Ubicación 2: Sede San Isidro",
    direccion: "Av. Conquistadores 456, San Isidro, Lima, Perú",
    telefono: "(01) 456 7891", whatsapp: "+51 954 302 181",
    descripcion: "Un espacio para reuniones privadas y experiencias gastronómicas de alto nivel. Ambiente sofisticado, atención personalizada y propuesta culinaria exclusiva.",
    imagen: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80"
  }
];

export default function Ubicacion() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: '1000px', margin: '40px auto', padding: '0 20px', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ textAlign: 'center', fontSize: '38px', color: '#fff', marginBottom: '35px' }}>Nos ubicamos</h1>
        {SEDES.map((sede) => (
          <div key={sede.id} className="ubicacion-card">
            <img src={sede.imagen} alt={sede.nombre} />
            <div className="ubicacion-content">
              <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 8px' }}>{sede.nombre}</h3>
              <p style={{ color: 'var(--gold-secondary)', fontSize: '13px', margin: '0 0 14px' }}>📍 {sede.direccion}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6', margin: '0 0 18px' }}>{sede.descripcion}</p>
              <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '20px' }}>
                <div><strong>Teléfono:</strong> {sede.telefono}</div>
                <div><strong>WhatsApp:</strong> {sede.whatsapp}</div>
              </div>
              <Link to="/reservas" className="btn-gold" style={{ fontSize: '13px' }}>Reservar en esta sede</Link>
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
