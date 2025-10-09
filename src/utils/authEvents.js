// Pequeño pub/sub para comunicar cambios de autenticación dentro de la app //TODO: cambiar por AuthProvider
const listeners = new Set();

export default {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  emit(payload) {
    listeners.forEach((fn) => {
      try {
        fn(payload);
      } catch (e) {
        // ignorar errores en listeners individuales
      }
    });
  },
};
