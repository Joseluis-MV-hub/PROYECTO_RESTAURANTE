import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BEBIDAS, PLATOS } from '../data/mockData';

export default function Carta() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="carta-container">
        <div className="peru-flag" role="img" aria-label="Bandera del Perú" />
        <h1 style={{ textAlign: 'center', fontSize: '38px', color: '#fff', marginBottom: '25px' }}>Nuestra Carta</h1>

        <h2 className="carta-section-header">BEBIDAS</h2>
        <div className="carta-grid">
          {BEBIDAS.map((item) => (
            <div key={item.id} className="dish-card-compact">
              <h3 className="dish-image-title">{item.nombre}</h3>
              <img src={item.imagen} alt={item.nombre} />
              <div className="dish-price-badge">
                <span className="price-currency">S/</span>
                <span className="price-amount">{item.precio.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="carta-section-header">PLATOS</h2>
        <div className="carta-grid">
          {PLATOS.map((item) => (
            <div key={item.id} className="dish-card-compact">
              <h3 className="dish-image-title">{item.nombre}</h3>
              <img src={item.imagen} alt={item.nombre} />
              <div className="dish-price-badge">
                <span className="price-currency">S/</span>
                <span className="price-amount">{item.precio.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
