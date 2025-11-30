import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/interceptors';
import { useAuth } from '../auth/AuthProvider';
import ItemHistorial from './ItemHistorial';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import {
  agruparPorMes,
  diaActual,
  diferenciaTiempo,
  estaAHorario,
  hayClasesHoy,
  horaActual,
  mesActual,
  TraerClaseHoy,
} from './util/formatoFecha'; //auxiliar para formatear fechas de año-mes a formato legible

import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from '../config/theme';
import { Button, IconButton, Text } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

export default function HistorialAxios() {
  const [historial, setHistorial] = useState([]);
  const [historialAgrupado, setHistorialAgrupado] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();
  const [mesSeleccionado, setMesSeleccionado] = useState('todos');
  const [openDropdown, setOpenDropdown] = useState(false);
  const { theme } = useTheme();

  // Preparar items para DropDownPicker
  const mesesItems = [
    { label: 'Todos', value: 'todos' },
    ...historialAgrupado.map(grupo => ({
      label: grupo.mes,
      value: grupo.mes,
    })),
  ];

  const historialFiltrado =
    mesSeleccionado === 'todos'
      ? historialAgrupado
      : historialAgrupado.filter(item => item.mes === mesSeleccionado);

  useEffect(() => {
    axiosInstance
      .get(`/reservas/usuario/${user.id}`)
      .then(respuesta => {
        //console.log(respuesta.data)
        setHistorial(respuesta.data);
        setHistorialAgrupado(agruparPorMes(respuesta.data));
      })
      .catch(error => {
        console.log('Error al obtener reservas', error);
        setError(true);
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: theme.colors.background,
        }}
      >
        {cargando ? (
          <ActivityIndicator size={'large'} />
        ) : error ? (
          <Text style={{ color: theme.colors.error }}>
            Error al hacer Fetch
          </Text>
        ) : (
          //Caso del axios exitoso
          <>
            <DropDownPicker
              open={openDropdown}
              value={mesSeleccionado}
              items={mesesItems}
              setOpen={setOpenDropdown}
              setValue={setMesSeleccionado}
              placeholder="Seleccionar mes"
              style={{
                borderColor: theme.colors.outline,
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                minHeight: 48,
              }}
              dropDownContainerStyle={{
                borderColor: theme.colors.outline,
                backgroundColor: theme.colors.surface,
                borderRadius: 12,
                elevation: 4,
              }}
              textStyle={{
                color: theme.colors.onSurface,
                fontSize: 16,
              }}
              ArrowUpIconComponent={() => (
                <IconButton
                  icon="chevron-up"
                  size={20}
                  iconColor={theme.colors.primary}
                />
              )}
              ArrowDownIconComponent={() => (
                <IconButton
                  icon="chevron-down"
                  size={20}
                  iconColor={theme.colors.primary}
                />
              )}
            />
            <FlatList
              data={historialFiltrado}
              renderItem={({ item }) => (
                <>
                  {item.historial.map(reserva => (
                    <ItemHistorial key={reserva.id} item={reserva} />
                  ))}
                </>
              )}
            />
          </>
        )}
        <Button mode="outlined" onPress={() => notificacionLocal()}>
          Enviar Notificación
        </Button>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 8,
          }}
        >
          <Button
            style={{ flex: 1 }}
            mode="outlined"
            onPress={() => probarTareaSecundaria()}
          >
            Probar Notificacion
          </Button>
          <Button
            style={{ flex: 1 }}
            mode="outlined"
            onPress={() => verTareas()}
          >
            Ver Permisos
          </Button>
        </View>
      </View>
    </>
  );

  async function probarTareaSecundaria() {
    await BackgroundTask.triggerTaskWorkerForTestingAsync();
  }

  async function verTareas() {
    TaskManager.getRegisteredTasksAsync().then(tasks => {
      console.log(tasks);
    });
  }

  //Notificacion Manual
  async function notificacionLocal() {
    const hayClases = hayClasesHoy(historialAgrupado);
    console.log(`Hay Clases Hoy: ${hayClases} `);
    if (hayClases) {
      const claseHoy = TraerClaseHoy(historialAgrupado);
      const diferenciaEnHoras = diferenciaTiempo(claseHoy.horarioInicio);
      const estaATiempo = estaAHorario(claseHoy.horarioInicio);
      console.log(`Esta a Tiempo: ${estaATiempo}`);
      if (estaATiempo) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Notificación manual - ${new Date().toLocaleTimeString()}`,
            body: `Tenes una clase de ${claseHoy.disiplina} en la sede ${claseHoy.sede} a las ${claseHoy.horarioInicio}, en ${diferenciaEnHoras.horas} horas y ${diferenciaEnHoras.minutos} minutos.`,
          },
          trigger: null,
        });
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Notificación manual - ${new Date().toLocaleTimeString()}`,
            body: `Tu clase de ${claseHoy.disiplina} en la sede ${claseHoy.sede} a las ${claseHoy.horarioInicio} ya ha comenzado hace ${-diferenciaEnHoras.horas} horas y ${-diferenciaEnHoras.minutos} minutos.`,
          },
          trigger: null,
        });
      }
    } else {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Notificación manual - ${new Date().toLocaleTimeString()}`,
          body: `hoy ${diaActual()} no tienes clases programadas.`,
        },
        trigger: null,
      });
    }
  }
}
