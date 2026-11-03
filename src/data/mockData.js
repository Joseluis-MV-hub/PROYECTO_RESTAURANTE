import gale1 from '../img/gale 1.jpg';
import gale2 from '../img/gale 2.jpg';
import gale3 from '../img/gale 3.jpg';
import gale4 from '../img/gale 4.jpg';
import gale5 from '../img/gale 5.jpg';
import gale6 from '../img/gale 6.jpg';
import gale7 from '../img/gale 7.jpg';
import carta0 from '../img/carta0.jpg';
import carta1 from '../img/carta1.jpg';
import carta2 from '../img/carta2.jpg';
import carta3 from '../img/carta3.jpg';
import carta4 from '../img/carta4.jpg';
import carta5 from '../img/carta5.jpg';
import carta6 from '../img/carta6.jpg';
import carta7 from '../img/carta7.jpg';
import carta8 from '../img/carta8.jpg';
import carta9 from '../img/carta9.jpg';
import carta10 from '../img/carta10.jpg';
import carta11 from '../img/carta11.jpg';

export const RESTAURANT_INFO = {
  name: "Mi Propiedad Privada",
  slogan: "El sabor de compartir buenos momentos",
  phone: "+51 997 568 990",
  address: "Av. Principal 123, Lima, Perú",
  facebook: "@LaPropiedadPrivada",
  instagram: "@LaPropiedadPrivada",
  horario: "Lunes a Domingo: 12:00 pm - 11:00 pm",
};

export const PLATOS = [
  {
    id: 1,
    nombre: "Ceviche",
    categoria: "platos",
    tipo: "comedor",
    precio: 40.00,
    descripcion: "Pescado fresco del día, leche de tigre tradicional, choclo desgranado y camote glaseado.",
    imagen: carta8,
    disponible: true
  },
  {
    id: 2,
    nombre: "Anticucho",
    categoria: "platos",
    tipo: "comedor",
    precio: 35.00,
    descripcion: "Tiernos cortes macerados en ají panca, acompañados de papas doradas y choclo tierno.",
    imagen: carta0,
    disponible: true
  },
  {
    id: 3,
    nombre: "Ají de Gallina",
    categoria: "platos",
    tipo: "comedor",
    precio: 35.00,
    descripcion: "Lomo fino flambeado al wok con cebolla, tomate, ají amarillo, papas crocantes y arroz.",
    imagen: carta6,
    disponible: true
  },
  {
    id: 4,
    nombre: "Pachamanca",
    categoria: "platos",
    tipo: "comedor",
    precio: 50.00,
    descripcion: "Suave masa de papa amarilla con ají amarillo, rellena de pulpa de cangrejo y palta.",
    imagen: carta4,
    disponible: true
  },
  {
    id: 5,
    nombre: "Causa",
    categoria: "platos",
    tipo: "comedor",
    precio: 40.00,
    descripcion: "Arroz norteño meloso con mixtura de mariscos selectos, queso parmesano y salsa criolla.",
    imagen: carta1,
    disponible: true
  },
  {
    id: 6,
    nombre: "Arroz con Pollo",
    categoria: "platos",
    tipo: "comedor",
    precio: 40.00,
    descripcion: "Clásico tacu tacu crocante servido con jugoso asado de tira en reducción de chicha de jora.",
    imagen: carta11,
    disponible: true
  }
];

export const BEBIDAS = [
  {
    id: 101,
    nombre: "Chicha Morada",
    categoria: "bebidas",
    tipo: "comedor",
    precio: 20.00,
    descripcion: "Maíz morado hervido con piña, membrillo, canela, clavo y gotas de limón fresco.",
    imagen: carta2,
    disponible: true
  },
  {
    id: 102,
    nombre: "Inka Cola",
    categoria: "bebidas",
    tipo: "comedor",
    precio: 15.00,
    descripcion: "Pisco Quebranta premium, pulpa de maracuyá fresca, jarabe y amargo de angostura.",
    imagen: carta3,
    disponible: true
  },
  {
    id: 103,
    nombre: "Chicha de Jora",
    categoria: "bebidas",
    tipo: "comedor",
    precio: 30.00,
    descripcion: "Naranjas recién exprimidas al instante.",
    imagen: carta5,
    disponible: true
  },
  {
    id: 104,
    nombre: "Pisco Sour",
    categoria: "bebidas",
    tipo: "comedor",
    precio: 30.00,
    descripcion: "Pisco aromático, ginger ale, zumo de limón y gotas de amargo de angostura.",
    imagen: carta7,
    disponible: true
  },
  {
    id: 105,
    nombre: "Maracuyá",
    categoria: "bebidas",
    tipo: "comedor",
    precio: 25.00,
    descripcion: "Botella 330ml bien helada.",
    imagen: carta9,
    disponible: true
  },
  {
    id: 106,
    nombre: "Machu Picchu",
    categoria: "bebidas",
    tipo: "comedor",
    precio: 35.00,
    descripcion: "Nuestra receta emblema con pisco Italia seleccionado.",
    imagen: carta10,
    disponible: true
  }
];

export const GALERIA = [
  { id: 1, titulo: "Ceviche Mixto Especial", categoria: "platos", img: "https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80" },
  { id: 2, titulo: "Salón Principal VIP", categoria: "ambientes", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80" },
  { id: 3, titulo: "Mesa Reservada Romántica", categoria: "ambientes", img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80" },
  { id: 4, titulo: "Coctelería de Autor", categoria: "bebidas", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80" },
  { id: 5, titulo: "Terraza Nocturna Panorámica", categoria: "ambientes", img: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80" },
  { id: 6, titulo: "Corte Angus a la Parrilla", categoria: "platos", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
  { id: 7, titulo: "Ambiente Íntimo Cava", categoria: "ambientes", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80" },

  { id: 8, titulo: "Evento Privado - Recepción", categoria: "eventos", img: gale1 },
  { id: 9, titulo: "Evento Especial - Gala", categoria: "eventos", img: gale2 },
  { id: 10, titulo: "Celebración y Brindis", categoria: "eventos", img: gale3 },
  { id: 11, titulo: "Noche de Aniversario", categoria: "eventos", img: gale4 },
  { id: 12, titulo: "Cena Corporativa Exclusiva", categoria: "eventos", img: gale5 },
  { id: 13, titulo: "Encuentro Familiar", categoria: "eventos", img: gale6 },
  { id: 14, titulo: "Velada de Coctelería", categoria: "eventos", img: gale7 }
];

export const SEDES = [
  {
    id: 1,
    nombre: "Ubicación 1: Sede Miraflores",
    direccion: "Av. Principal 123, Miraflores, Lima, Perú",
    telefono: "(01) 456 7890",
    whatsapp: "+51 997 568 990",
    descripcion: "Un ambiente cálido y elegante pensado para compartir momentos especiales. Descubre un espacio de diseño contemporáneo, servicio atento y una experiencia gastronómica premium.",
    imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    nombre: "Ubicación 2: Sede San Isidro",
    direccion: "Av. Conquistadores 456, San Isidro, Lima, Perú",
    telefono: "(01) 456 7891",
    whatsapp: "+51 987 654 321",
    descripcion: "Un espacio pensado para reuniones privadas y experiencias gastronómicas de alto nivel. Disfruta de un ambiente sofisticado, atención personalizada y una propuesta culinaria exclusiva.",
    imagen: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80"
  }
];

export const MESAS_INICIALES = [
  { id: 1, numero: "01", capacidad: 4, estado: "ocupada", comanda: { ordenId: 1024, mozo: "Carlos M.", items: [{ nombre: "Ceviche Clásico", cantidad: 2, precio: 35 }, { nombre: "Pisco Sour", cantidad: 2, precio: 27 }], total: 124 } },
  { id: 2, numero: "02", capacidad: 2, estado: "libre", comanda: null },
  { id: 3, numero: "03", capacidad: 6, estado: "ocupada", comanda: { ordenId: 1025, mozo: "Ana R.", items: [{ nombre: "Lomo Saltado", cantidad: 3, precio: 45 }], total: 135 } },
  { id: 4, numero: "04", capacidad: 4, estado: "reservada", comanda: null },
  { id: 5, numero: "05", capacidad: 2, estado: "libre", comanda: null },
  { id: 6, numero: "06", capacidad: 8, estado: "ocupada", comanda: { ordenId: 1026, mozo: "Carlos M.", items: [{ nombre: "Arroz con Mariscos", cantidad: 4, precio: 45 }], total: 180 } },
  { id: 7, numero: "07", capacidad: 4, estado: "libre", comanda: null },
  { id: 8, numero: "08", capacidad: 4, estado: "libre", comanda: null }
];

export const RECLAMACIONES_INICIALES = [
  {
    id: 101,
    codigo: "REC-2026-001",
    fecha: "2026-10-25 21:15",
    tipo: "Reclamo",
    nombre: "Valeria Morales Mendoza",
    dni: "72849102",
    telefono: "987 654 321",
    correo: "valeria.morales@gmail.com",
    sede: "Miraflores",
    asunto: "Demora en entrega de plato de fondo",
    detalle: "Realizamos nuestro pedido a las 20:30 y el segundo plato demoró más de 50 minutos en llegar a la mesa.",
    peticion: "Mayor control en tiempos de cocina en horas punta.",
    estado: "En Proceso"
  },
  {
    id: 102,
    codigo: "REC-2026-002",
    fecha: "2026-10-26 14:30",
    tipo: "Queja",
    nombre: "Fernando Castro Silva",
    dni: "45902183",
    telefono: "991 223 344",
    correo: "fernando.castro@hotmail.com",
    sede: "San Isidro",
    asunto: "Atención poco cordial en recepción",
    detalle: "Teníamos reserva confirmada para las 14:00 y nos hicieron esperar 20 minutos de pie en la entrada sin explicación.",
    peticion: "Capacitación en trato al cliente y agilidad con reservas web.",
    estado: "Pendiente"
  },
  {
    id: 103,
    codigo: "REC-2026-003",
    fecha: "2026-10-26 19:40",
    tipo: "Sugerencia",
    nombre: "Claudia Benavides",
    dni: "71209384",
    telefono: "965 443 211",
    correo: "claudia.bena@yahoo.com",
    sede: "Miraflores",
    asunto: "Añadir más opciones sin gluten en postres",
    detalle: "La comida estuvo excelente, pero nos gustaría ver opciones de postres aptos para personas celíacas.",
    peticion: "Incluir al menos dos postres sin gluten en la carta de comedor.",
    estado: "Atendido"
  }
];





// RESERVAS


export const mesasIniciales = [
  { id: 1, numero: 1, capacidad: 2, zona: "Salón", estado: "libre", nota: "—", habilitada: true },
  { id: 2, numero: 2, capacidad: 4, zona: "Salón", estado: "ocupada", nota: "Con comanda abierta", habilitada: true },
  { id: 3, numero: 3, capacidad: 2, zona: "Salón", estado: "cobrar", nota: "Con comanda abierta", habilitada: true },
  { id: 4, numero: 4, capacidad: 4, zona: "Salón", estado: "ocupada", nota: "Con comanda abierta", habilitada: true },
  { id: 5, numero: 5, capacidad: 2, zona: "Terraza", estado: "fuera", nota: "Pata rota - hasta el lun 03/11", habilitada: false },
];

export const etiquetas = {
  libre: "Libre",
  ocupada: "Ocupada",
  cobrar: "Por cobrar",
  fuera: "Fuera de servicio",
};

export const motivos = [
  "Mesa Dañada",
  "Silla rota",
  "Limpieza profunda",
  "Mantenimiento",
  "Reservada para evento",
  "Otro",
];