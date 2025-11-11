import React, { useEffect, useState } from 'react'
import axiosInstance from '../config/axios'
import { useAuth } from '../auth/AuthProvider'
import ItemHistorial from './ItemHistorial';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import {agruparPorMes} from './util/formatoFecha'; //auxiliar para formatear fechas de año-mes a formato legible
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '../config/theme';

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
        console.log(respuesta.data)
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
    <Text style={styles.title}>HistorialAxios</Text>
    <View style={styles.separador}></View>
    {cargando ? <ActivityIndicator size={'large'}/> : (error ? <Text style={styles.alerta} >Error al hacer Fetch</Text> :
    //Caso del axios exitoso
    <>
    <Picker
      selectedValue={mesSeleccionado}
      onValueChange={(value)=>{ 
        setMesSeleccionado(value)
        console.log(value)}}
        style={{backgroundColor: theme.colors.secondary, borderRadius: 8,padding:10}}
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
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f8fc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1c1c1e",
    textAlign: "center",
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

