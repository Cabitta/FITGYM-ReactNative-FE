import React, { useEffect, useState } from 'react'
import axiosInstance from '../config/axios'
import { useAuth } from '../auth/AuthProvider'
import ItemHistorial from './ItemHistorial';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import {agruparPorMes, diaActual, diferenciaTiempo, estaAHorario, hayClasesHoy, horaActual, mesActual, TraerClaseHoy} from './util/formatoFecha'; //auxiliar para formatear fechas de año-mes a formato legible
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../config/theme';
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

export default function HistorialAxios() {

  const [historial,setHistorial] = useState([])
  const [historialAgrupado,setHistorialAgrupado] = useState([])
  const [cargando,setCargando] = useState(true)
  const [error,setError] = useState(false)
  const {user} = useAuth();
  const [mesSeleccionado, setMesSeleccionado] = useState("todos");
  const { theme } = useTheme();

  const historialFiltrado = mesSeleccionado === "todos"
    ? historialAgrupado
    : historialAgrupado.filter((item) => item.mes === mesSeleccionado);

  useEffect(()=>{
    axiosInstance.get(`/reservas/usuario/${user.id}`)
      .then(respuesta=>{
        //console.log(respuesta.data)
        setHistorial(respuesta.data)
        setHistorialAgrupado(agruparPorMes(respuesta.data))
      })
      .catch(error=>{
        console.log("Error al obtener reservas", error);
        setError(true)
      })
      .finally(()=> setCargando(false))
    
  },[])

  return (
    <>
    <SafeAreaView style={{flex: 1, padding: 0, backgroundColor: theme.colors.background,}}>
    <View style={[styles.container]}>
    <Text variant='titleLarge' style={{color: theme.colors.primary,
          fontWeight: "bold",
          textAlign: "center",}}
          >Historial de Turnos</Text>
    <View style={styles.separador}></View>
    {cargando ? <ActivityIndicator size={'large'}/> : (error ? <Text style={styles.alerta} >Error al hacer Fetch</Text> :
    //Caso del axios exitoso
    <>
    <Picker
      selectedValue={mesSeleccionado}
      onValueChange={(value)=>{ 
        setMesSeleccionado(value)
        console.log(value)}}
        style={{backgroundColor: theme.colors.secondary, borderRadius:32 ,padding:0}}
    >
      <Picker.Item label='Todos' value="todos"/>
      {historialAgrupado.map((grupo,index)=>(
        <Picker.Item key={index} label={grupo.mes} value={grupo.mes}/>
      ))}
      </Picker>
    <FlatList
      data={historialFiltrado}
      renderItem={({item})=>(
        <>
          {item.historial.map((reserva)=><ItemHistorial key={reserva.id} item={reserva}/>)}
        </>
      )}
    />
      
    </>
    )}
    </View>
    {/*Ya esta por Fecha*/}
    <Button mode="outlined" onPress={() => notificacionLocal()}>Enviar Notificación</Button>
    </SafeAreaView>
    </>
  )

  //Notificacion Manual
  async function notificacionLocal() {
    const hayClases = hayClasesHoy(historialAgrupado);
    console.log(`Hay Clases Hoy: ${hayClases} `);
    if (hayClases) {
      const claseHoy = TraerClaseHoy(historialAgrupado);
      const diferenciaEnHoras = diferenciaTiempo(claseHoy.horarioInicio);
      const estaATiempo = estaAHorario(claseHoy.horarioInicio);
      console.log(`Esta a Tiempo: ${estaATiempo}`)
      if (estaATiempo) {
        await Notifications.scheduleNotificationAsync({
        content:{
          title: `Notificación manual - ${new Date().toLocaleTimeString()}`,
          body: `Tenes una clase de ${claseHoy.disiplina} en la sede ${claseHoy.sede} a las ${claseHoy.horarioInicio}, en ${diferenciaEnHoras.horas} horas y ${diferenciaEnHoras.minutos} minutos.`,
        },
        trigger: null,
        })
      }else{
        await Notifications.scheduleNotificationAsync({
        content:{
          title: `Notificación manual - ${new Date().toLocaleTimeString()}`,
          body: `Tu clase de ${claseHoy.disiplina} en la sede ${claseHoy.sede} a las ${claseHoy.horarioInicio} ya ha comenzado hace ${-diferenciaEnHoras.horas} horas y ${-diferenciaEnHoras.minutos} minutos.`,
        },
        trigger: null,
        })
      }
    }else{
      await Notifications.scheduleNotificationAsync({
      content:{
        title: `Notificación manual - ${new Date().toLocaleTimeString()}`,
        body: `hoy ${diaActual()} no tienes clases programadas.`,
      },
      trigger: null,
      })
    }
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 16,
  },
  alerta:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: "center",
  },
  separador: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000ff",
    marginVertical: 12,
    alignSelf: 'stretch'
  }
})

