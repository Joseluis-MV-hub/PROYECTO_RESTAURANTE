export const MESAS_INICIALES = Array.from({ length: 12 }, (_, index) => {
  const numero = index + 1;
  const fueraDeServicio = numero === 5;

  return {
    id: numero,
    numero: String(numero).padStart(2, '0'),
    capacidad: numero % 2 === 0 ? 4 : 2,
    zona: numero === 5 ? 'Terraza' : 'Salón',
    estado: fueraDeServicio ? 'Fuera de servicio' : 'Libre',
    motivo: fueraDeServicio ? 'Mantenimiento programado' : '',
    habilitada: !fueraDeServicio,
  };
});

export const leerMesasAdministrativas = () => {
  try {
    const valor = JSON.parse(localStorage.getItem('mpp_admin_mesas') || 'null');
    return Array.isArray(valor) ? valor : MESAS_INICIALES;
  } catch {
    return MESAS_INICIALES;
  }
};

const minutosDeHora = (hora) => {
  const [horas, minutos] = String(hora || '0:0').split(':').map(Number);
  return horas * 60 + minutos;
};

const fechaDeHoy = () => {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
};

const RESERVAS_DEMO = [
  ['01', '13:00', 'Pérez', 2, 'Confirmada'], ['01', '20:00', 'Quispe', 2, 'Confirmada'],
  ['02', '13:30', 'Ana Torres', 4, 'Sentado'], ['02', '20:30', 'Luis Vega', 4, 'Confirmada'],
  ['03', '14:00', 'Rojas', 2, 'Pendiente'], ['03', '19:30', 'Mendoza', 2, 'Confirmada'],
  ['04', '15:00', 'Familia Castro', 4, 'Por cobrar'], ['04', '21:00', 'Díaz', 4, 'Confirmada'],
  ['06', '12:30', 'Cumpleaños Salas', 6, 'Confirmada'], ['06', '19:00', 'Valdez', 4, 'Confirmada'],
  ['07', '14:30', 'Mariana Ruiz', 4, 'Confirmada'], ['07', '20:00', 'Núñez', 4, 'Pendiente'],
  ['08', '13:00', 'Soto', 4, 'Confirmada'], ['08', '21:00', 'Dávila', 6, 'Confirmada'],
  ['09', '15:30', 'Mendoza', 2, 'Confirmada'], ['09', '19:00', 'García', 2, 'Confirmada'],
  ['10', '13:30', 'Grupo Flores', 6, 'Confirmada'], ['10', '20:30', 'Paredes', 4, 'Confirmada'],
  ['11', '16:00', 'Familia León', 4, 'Confirmada'], ['11', '19:30', 'Vargas', 2, 'Confirmada'],
  ['12', '12:00', 'Salazar', 4, 'Confirmada'], ['12', '21:30', 'Bruno', 4, 'Confirmada'],
];

export const leerReservas = () => {
  try {
    const guardadas = localStorage.getItem('mpp_reservas');
    const reservasGuardadas = guardadas ? JSON.parse(guardadas) : [];
    const reservas = Array.isArray(reservasGuardadas) ? reservasGuardadas : [];
    if (localStorage.getItem('mpp_reservas_demo_seeded') === 'true') return reservas;

    const fecha = fechaDeHoy();
    const demostracion = RESERVAS_DEMO.map(([mesa, turno, nombre, personas, estado], index) => ({
      id: `demo-${fecha}-${index + 1}`,
      codigo: `MPP-DEMO-${String(index + 1).padStart(3, '0')}`,
      mesa,
      turno,
      nombre,
      personas: String(personas),
      fecha,
      duracion: 105,
      estado,
      sede: 'Miraflores',
      origen: 'Demostración',
    }));
    const combinadas = [...reservas];
    demostracion.forEach((demo) => {
      const inicioDemo = minutosDeHora(demo.turno);
      const finDemo = inicioDemo + demo.duracion;
      const conflicto = combinadas.some((reserva) => {
        if (reserva.fecha !== demo.fecha || String(reserva.mesa || '') !== demo.mesa || ['cancelada', 'terminada'].includes(String(reserva.estado || '').toLowerCase())) return false;
        const inicioReserva = minutosDeHora(reserva.turno);
        const finReserva = inicioReserva + Number(reserva.duracion || 105);
        return inicioDemo < finReserva && finDemo > inicioReserva;
      });
      if (!conflicto) combinadas.push(demo);
    });

    localStorage.setItem('mpp_reservas', JSON.stringify(combinadas));
    localStorage.setItem('mpp_reservas_demo_seeded', 'true');
    return combinadas;
  } catch {
    return [];
  }
};

export const obtenerMesasDisponibles = ({ mesas, reservas, fecha, turno, personas, duracion = 105 }) => {
  const inicio = minutosDeHora(turno);
  const fin = inicio + Number(duracion);

  return mesas.filter((mesa) => {
    if (!mesa.habilitada) return false;
    if (Number(mesa.capacidad) < Number(personas)) return false;

    return !reservas.some((reserva) => {
      if (reserva.fecha !== fecha || String(reserva.mesa || '') !== String(mesa.numero) || String(reserva.estado || '').toLowerCase() === 'cancelada') return false;
      const inicioExistente = minutosDeHora(reserva.turno);
      const finExistente = inicioExistente + Number(reserva.duracion || 105);
      return inicio < finExistente && fin > inicioExistente;
    });
  });
};
