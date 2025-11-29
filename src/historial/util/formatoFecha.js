export function formatearFecha(fecha) {
  const [año, mes] = fecha.split('-');
  const fechaSinFormato = new Date(año, mes - 1);
  const mesFormateado = fechaSinFormato.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
  return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);
}

export function convertirAgrupacionALista(agrupacion) {
  return Object.entries(agrupacion).map(([key, items]) => {
    return {
      mes: formatearFecha(key),
      historial: items,
    };
  });
}

export function agruparPorMes(historial = []) {
  let agrupacion = historial.reduce((acumulador, item) => {
    const [año, mes] = item.clase.fecha.split('-');
    const clave = `${año}-${mes}`;
    if (!acumulador[clave]) {
      acumulador[clave] = [];
    }
    acumulador[clave].push({
      id: item.idReserva,
      fecha: item.clase.fecha,
      disiplina: item.clase.disciplina,
      horarioInicio: item.clase.horarioInicio,
      horarioFin: item.clase.horarioFin,
      sede: item.sede.nombre,
      barrio: item.sede.barrio,
      estado: item.estado,
    });
    return acumulador;
  }, {});

  agrupacion = convertirAgrupacionALista(agrupacion);

  return agrupacion;
}

export function mesActual() {
  const fechaActual = new Date();
  const mesFormateado = fechaActual.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
  });
  return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);
}

export function diaActual() {
  const fechaActual = new Date();
  let diaFormateado = fechaActual.toLocaleString('es-ES', {
    month: '2-digit',
    year: 'numeric',
    day: 'numeric',
  });
  diaFormateado =
    diaFormateado.charAt(0).toUpperCase() + diaFormateado.slice(1);
  const [dia, mes, año] = diaFormateado.split('/');
  return `${año}-${mes}-${dia}`;
}

export function hayClasesHoy(historialAgrupado) {
  const mesHoy = mesActual();
  const exitensClases = historialAgrupado.some(grupo => grupo.mes === mesHoy);
  if (exitensClases) {
    const clasesDelMes = historialAgrupado.find(
      grupo => grupo.mes === mesHoy
    ).historial;
    //const diaHoy = diaActual()
    const diaHoy = '2025-11-25';
    //cambiar diaActual() con una clase pasada para comprobar el caso positivo
    const hayClaseHoy = clasesDelMes.some(clase => clase.fecha === diaHoy);
    if (hayClaseHoy) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function TraerClaseHoy(historialAgrupado) {
  const mesHoy = mesActual();
  const clasesDelMes = historialAgrupado.find(
    grupo => grupo.mes === mesHoy
  ).historial;
  //const diaHoy = diaActual()
  const diaHoy = '2025-11-25';
  //cambiar diaActual() con una clase pasada para comprobar el caso positivo
  const hayClaseHoy = clasesDelMes.find(clase => clase.fecha === diaHoy);
  return hayClaseHoy;
}

export function diferenciaTiempo(horaInicio) {
  const ahora = new Date();
  const [hora, minutos, segundos] = horaInicio.split(':');
  const turnoInicio = new Date();
  turnoInicio.setHours(Number(hora), Number(minutos), Number(segundos), 0);
  const diferenciaMilisegundos = turnoInicio - ahora;
  const diferenciaMinutosTotales = Math.floor(
    diferenciaMilisegundos / 1000 / 60
  );
  return {
    horas: Math.floor(diferenciaMinutosTotales / 60),
    minutos: diferenciaMinutosTotales % 60,
  };
}

export function estaAHorario(horaInicio) {
  const ahora = new Date();
  const [hora, minutos, segundos] = horaInicio.split(':');
  const turnoInicio = new Date();
  turnoInicio.setHours(Number(hora), Number(minutos), Number(segundos), 0);
  return turnoInicio > ahora;
}
