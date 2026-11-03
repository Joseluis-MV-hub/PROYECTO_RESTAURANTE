import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import gale1 from '../img/gale 1.jpg';
import gale2 from '../img/gale 2.jpg';
import gale3 from '../img/gale 3.jpg';
import gale4 from '../img/gale 4.jpg';
import gale5 from '../img/gale 5.jpg';
import gale6 from '../img/gale 6.jpg';
import gale7 from '../img/gale 7.jpg';

const GALERIA = [
  { id: 1, titulo: "Ceviche Mixto Especial", categoria: "platos", img: "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80" },
  { id: 2, titulo: "Salón Principal VIP", categoria: "ambientes", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" },
  { id: 3, titulo: "Mesa Reservada Romántica", categoria: "ambientes", img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80" },
  { id: 4, titulo: "Coctelería de Autor", categoria: "bebidas", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
  { id: 5, titulo: "Terraza Nocturna", categoria: "ambientes", img: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80" },
  { id: 6, titulo: "Corte Angus a la Parrilla", categoria: "platos", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
  { id: 7, titulo: "Ambiente Íntimo Cava", categoria: "ambientes", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80" },
  { id: 8, titulo: "Evento Privado - Recepción", categoria: "eventos", img: gale1 },
  { id: 9, titulo: "Evento Especial - Gala", categoria: "eventos", img: gale2 },
  { id: 10, titulo: "Celebración y Brindis", categoria: "eventos", img: gale3 },
  { id: 11, titulo: "Noche de Aniversario", categoria: "eventos", img: gale4 },
  { id: 12, titulo: "Cena Corporativa Exclusiva", categoria: "eventos", img: gale5 },
  { id: 13, titulo: "Encuentro Familiar", categoria: "eventos", img: gale6 },
  { id: 14, titulo: "Velada de Coctelería", categoria: "eventos", img: gale7 },
];

export default function Galeria() {
  const [filtro, setFiltro] = useState('todos');

  const itemsFiltrados = filtro === 'todos'
    ? GALERIA
    : GALERIA.filter((item) => item.categoria === filtro);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <div style={{ textAlign: 'center', marginTop: '40px', padding: '0 20px' }}>
          <h1 style={{ fontSize: '38px', color: '#fff', marginBottom: '8px' }}>Galería</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Conoce nuestros platos, ambientes y momentos especiales.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '25px', flexWrap: 'wrap' }}>
            {['todos', 'platos', 'ambientes', 'bebidas', 'eventos'].map((cat) => (
              <button
                key={cat}
                className={`btn-outline-gold ${filtro === cat ? 'active' : ''}`}
                onClick={() => setFiltro(cat)}
                style={{ textTransform: 'capitalize', fontSize: '13px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="galeria-grid">
          {itemsFiltrados.map((item) => (
            <div key={item.id} className="galeria-item">
              <img src={item.img} alt={item.titulo} />
              <div className="galeria-overlay"><strong>{item.titulo}</strong></div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
