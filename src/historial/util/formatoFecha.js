export function formatearFecha(fecha) {
  const [año, mes] = fecha.split("-");
  const fechaSinFormato = new Date(año, mes - 1);
  const mesFormateado = fechaSinFormato.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });
  return mesFormateado.charAt(0).toUpperCase() + mesFormateado.slice(1);
}

export function convertirAgrupacionALista(agrupacion){
  return Object.entries(agrupacion).map(([key,items])=>{
    return {
      mes: formatearFecha(key),
      historial: items,
    };
  });
}

export function agruparPorMes(historial = []){
  let agrupacion = historial.reduce((acumulador, item) => {
    const [año, mes] = item.clase.fecha.split("-");
    const clave = `${año}-${mes}`;
    if (!acumulador[clave]) { acumulador[clave] = []; }
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

