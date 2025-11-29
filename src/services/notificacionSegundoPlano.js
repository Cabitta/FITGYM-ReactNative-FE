import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import * as Notifications from 'expo-notifications';
import {
  diferenciaTiempo,
  diaActual,
  estaAHorario,
  TraerClaseHoy,
} from '../historial/util/formatoFecha';
import axiosInstance from '../config/axios';
import storage from '../utils/storage';
import { agruparPorMes, hayClasesHoy } from '../historial/util/formatoFecha';

export const NOTIFICACION_SEGUNDO_PLANO = 'NOTIFICACION_SEGUNDO_PLANO';

TaskManager.defineTask(NOTIFICACION_SEGUNDO_PLANO, async () => {
  try {
    let user = await storage.getItem('user_data');
    let historial;
    let historialAgrupado;
    if (!user) {
      console.log('No hay usuario logueado, no se envía notificación.');
      return;
    } else {
      user = JSON.parse(user);
      axiosInstance.get(`/reservas/usuario/${user.id}`).then(respuesta => {
        historial = respuesta.data;
        historialAgrupado = agruparPorMes(historial);
        const hayClases = hayClasesHoy(historialAgrupado);
        console.log(`Hay Clases Hoy: ${hayClases} `);
        if (hayClases) {
          const claseHoy = TraerClaseHoy(historialAgrupado);
          const diferenciaEnHoras = diferenciaTiempo(claseHoy.horarioInicio);
          const estaATiempo = estaAHorario(claseHoy.horarioInicio);
          console.log(`Esta a Tiempo: ${estaATiempo}`);
          if (estaATiempo) {
            Notifications.scheduleNotificationAsync({
              content: {
                title: `Notificación automática - ${new Date().toLocaleTimeString()}`,
                body: `Tenes una clase de ${claseHoy.disiplina} en la sede ${claseHoy.sede} a las ${claseHoy.horarioInicio}, en ${diferenciaEnHoras.horas} horas y ${diferenciaEnHoras.minutos} minutos.`,
              },
              trigger: null,
            });
          } else {
            Notifications.scheduleNotificationAsync({
              content: {
                title: `Notificación automática - ${new Date().toLocaleTimeString()}`,
                body: `Tu clase de ${claseHoy.disiplina} en la sede ${claseHoy.sede} a las ${claseHoy.horarioInicio} ya ha comenzado hace ${-diferenciaEnHoras.horas} horas y ${-diferenciaEnHoras.minutos} minutos.`,
              },
              trigger: null,
            });
          }
        } else {
          Notifications.scheduleNotificationAsync({
            content: {
              title: `Notificación automática - ${new Date().toLocaleTimeString()}`,
              body: `hoy ${diaActual()} no hay clases programadas.`,
            },
            trigger: null,
          });
        }
      });
    }
  } catch (error) {
    console.log('Error en la tarea de notificación en segundo plano:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});
