import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const PLATOS_INIT = [
  { id: 1, nombre: "Ceviche Clásico MPP", categoria: "platos", precio: 35.00, descripcion: "Pescado fresco, leche de tigre, choclo y camote glaseado.", disponible: true },
  { id: 2, nombre: "Anticuchos de Corazón", categoria: "platos", precio: 30.00, descripcion: "Cortes macerados en ají panca, papas doradas y choclo.", disponible: true },
  { id: 3, nombre: "Lomo Saltado Criollo", categoria: "platos", precio: 45.00, descripcion: "Lomo al wok con cebolla, tomate, ají amarillo y papas.", disponible: true },
  { id: 4, nombre: "Causa Limeña de Cangrejo", categoria: "platos", precio: 35.00, descripcion: "Papa amarilla con ají, rellena de cangrejo y palta.", disponible: true },
  { id: 5, nombre: "Arroz con Mariscos Especial", categoria: "platos", precio: 45.00, descripcion: "Arroz meloso con mariscos selectos y salsa criolla.", disponible: true },
  { id: 6, nombre: "Tacu Tacu con Seco de Asado", categoria: "platos", precio: 40.00, descripcion: "Tacu tacu crocante con asado en reducción de chicha.", disponible: true },
  { id: 101, nombre: "Chicha Morada de la Casa (1L)", categoria: "bebidas", precio: 15.00, descripcion: "Maíz morado con piña, canela, clavo y limón.", disponible: true },
  { id: 102, nombre: "Maracuyá Sour Artesanal", categoria: "bebidas", precio: 25.00, descripcion: "Pisco Quebranta, maracuyá y amargo de angostura.", disponible: true },
  { id: 103, nombre: "Jugo Natural de Naranja", categoria: "bebidas", precio: 7.00, descripcion: "Naranjas recién exprimidas.", disponible: true },
  { id: 104, nombre: "Chilcano Clásico", categoria: "bebidas", precio: 20.00, descripcion: "Pisco, ginger ale, limón y amargo de angostura.", disponible: true },
  { id: 105, nombre: "Cerveza Cusqueña Trigo", categoria: "bebidas", precio: 15.00, descripcion: "Botella 330ml bien helada.", disponible: true },
  { id: 106, nombre: "Pisco Sour Tradicional", categoria: "bebidas", precio: 27.00, descripcion: "Nuestra receta emblema con pisco Italia.", disponible: true },
];

export default function AdminMenu() {
  const [items, setItems] = useState([...PLATOS_INIT]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [nuevoPlato, setNuevoPlato] = useState({
    nombre: '',
    categoria: 'platos',
    precio: '',
    descripcion: ''
  });

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoPlato.nombre || !nuevoPlato.precio) return;

    const itemCreado = {
      id: Date.now(),
      nombre: nuevoPlato.nombre,
      categoria: nuevoPlato.categoria,
      precio: parseFloat(nuevoPlato.precio),
      descripcion: nuevoPlato.descripcion || 'Sin descripción',
      imagen: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      disponible: true
    };

    setItems([itemCreado, ...items]);
    setNuevoPlato({ nombre: '', categoria: 'platos', precio: '', descripcion: '' });
  };

  const alternarDisponibilidad = (id) => {
    setItems(items.map((it) => it.id === id ? { ...it, disponible: !it.disponible } : it));
  };

  const eliminarItem = (id) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const itemsFiltrados = items.filter((it) => {
    const coincideNombre = it.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = categoriaFiltro === 'todas' || it.categoria === categoriaFiltro;
    return coincideNombre && coincideCat;
  });

  return (
    <AdminLayout title="Catálogo y Menú">
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-dark)',
        borderRadius: '6px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            className="form-control-dark"
            placeholder="Buscar plato o bebida por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            className="form-control-dark"
            style={{ width: '160px' }}
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            <option value="platos">Platos</option>
            <option value="bebidas">Bebidas</option>
          </select>
        </div>

        <span style={{ color: 'var(--gold-light)', alignSelf: 'center', fontSize: '13px' }}>
          Total registros: {itemsFiltrados.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-dark)', borderRadius: '6px', overflow: 'hidden' }}>
          <table className="mpp-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {itemsFiltrados.map((it) => (
                <tr key={it.id}>
                  <td>
                    <strong>{it.nombre}</strong>
                    <br />
                    <small style={{ color: 'var(--text-muted)' }}>{it.descripcion?.slice(0, 40)}...</small>
                  </td>
                  <td>
                    <span style={{ textTransform: 'capitalize', fontSize: '11px', background: '#25252b', padding: '3px 8px', borderRadius: '4px' }}>
                      {it.categoria}
                    </span>
                  </td>
                  <td style={{ color: 'var(--gold-secondary)', fontWeight: 'bold' }}>
                    S/ {it.precio.toFixed(2)}
                  </td>
                  <td>
                    <button
                      onClick={() => alternarDisponibilidad(it.id)}
                      style={{
                        background: it.disponible ? 'rgba(72,187,120,0.15)' : 'rgba(229,62,62,0.15)',
                        color: it.disponible ? '#48bb78' : '#f56565',
                        border: 'none',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      {it.disponible ? '● Activo' : '○ Agotado'}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => eliminarItem(it.id)}
                      style={{ background: 'transparent', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '12px' }}
                      title="Eliminar plato"
                    >
                      ✕ Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          borderRadius: '6px',
          padding: '20px',
          height: 'fit-content'
        }}>
          <h4 style={{ margin: '0 0 16px', color: '#fff', fontSize: '16px' }}>+ Registrar Nuevo Plato / Bebida</h4>
          <form onSubmit={handleAgregar}>
            <div className="form-group-custom" style={{ marginBottom: '12px' }}>
              <label>Nombre del Producto</label>
              <input
                type="text"
                className="form-control-dark"
                placeholder="Ej. Arroz Chaufa Especial"
                value={nuevoPlato.nombre}
                onChange={(e) => setNuevoPlato({ ...nuevoPlato, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-group-custom" style={{ marginBottom: '12px' }}>
              <label>Categoría</label>
              <select
                className="form-control-dark"
                value={nuevoPlato.categoria}
                onChange={(e) => setNuevoPlato({ ...nuevoPlato, categoria: e.target.value })}
              >
                <option value="platos">Platos Criollos / Marinos</option>
                <option value="bebidas">Bebidas / Coctelería</option>
              </select>
            </div>

            <div className="form-group-custom" style={{ marginBottom: '12px' }}>
              <label>Precio de Venta (S/)</label>
              <input
                type="number"
                step="0.5"
                className="form-control-dark"
                placeholder="Ej. 38.00"
                value={nuevoPlato.precio}
                onChange={(e) => setNuevoPlato({ ...nuevoPlato, precio: e.target.value })}
                required
              />
            </div>

            <div className="form-group-custom" style={{ marginBottom: '16px' }}>
              <label>Descripción corta</label>
              <textarea
                rows="3"
                className="form-control-dark"
                placeholder="Ingredientes clave o preparación..."
                value={nuevoPlato.descripcion}
                onChange={(e) => setNuevoPlato({ ...nuevoPlato, descripcion: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '10px' }}>
              Guardar en Catálogo
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

