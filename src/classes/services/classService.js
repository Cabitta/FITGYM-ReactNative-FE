import api from '../../config/interceptors';

const batchFetchByIds = async (ids, buildUrl, pick) => {
  const uniq = Array.from(new Set(ids.filter(Boolean)));
  const entries = await Promise.all(
    uniq.map(async id => {
      try {
        const { data } = await api.get(buildUrl(id));
        return [id, pick(data)];
      } catch {
        return [id, null];
      }
    })
  );
  return Object.fromEntries(entries);
};

export const getClasesEnriched = async () => {
  const { data: clases } = await api.get('/clases/search');
  if (!Array.isArray(clases)) return [];

  const sedeIds = clases.map(c => c.idSede);
  const profIds = clases.map(c => c.idProfesor);

  const sedeMap = await batchFetchByIds(
    sedeIds,
    id => `/sedes/${id}`,
    s => s?.nombre ?? null
  );

  const profMap = await batchFetchByIds(
    profIds,
    id => `/profesores/${id}`,
    p => p?.nombre ?? null
  );

  return clases.map(c => ({
    ...c,
    sedeNombre: sedeMap[c.idSede] ?? '—',
    profesorNombre: profMap[c.idProfesor] ?? '—',
  }));
};
