// Convierte "2025-11-26" en Date local correcta
export const parseLocalDate = dateStr => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Convierte "10:25:10" a Date en el día dado
export const attachTimeToDate = (date, timeStr) => {
  if (!date || !timeStr) return null;
  const [h, m, s] = timeStr.split(':').map(Number);
  const d = new Date(date); // evitar mutar el objeto original
  d.setHours(h, m, s, 0);
  return d;
};

// Formato humano para FECHA
export const formatHumanDate = dateStr => {
  const d = parseLocalDate(dateStr);
  if (!d) return '—';

  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Formato humano para HORA
export const formatHumanTime = timeStr => {
  if (!timeStr) return '—';
  const [h, m] = timeStr.split(':');
  return `${h}:${m} hs`;
};
