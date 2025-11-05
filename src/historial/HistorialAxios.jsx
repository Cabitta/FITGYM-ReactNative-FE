import React, { useEffect, useState } from 'react'
import axiosInstance from '../config/axios'
import { useAuth } from '../auth/AuthProvider'
import ItemHistorial from './ItemHistorial';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function HistorialAxios() {

  const [historial,setHistorial] = useState(null)
  const [cargando,setCargando] = useState(true)
  const [error,setError] = useState(false)
  
  const {user} = useAuth(); 

  useEffect(()=>{
    console.log(user)
    axiosInstance.get(`/reservas/usuario/${user.id}`)
      .then(respuesta=>{
        console.log(respuesta.status)
        console.log(respuesta.data)
        console.log(respuesta.data[0])
        setHistorial(respuesta.data)
      })
      .catch(error=>{
        console.log("Error al obtener reservas", error);
        setError(true)
      })
      .finally(()=> setCargando(false))

    
  },[])
  return (
    <>
    <View style={styles.container}>
    <Text style={styles.title}>HistorialAxios</Text>
    <View style={styles.separador}></View>
    {cargando ? <ActivityIndicator size={'large'}/> : (error ? <Text style={styles.alerta} >Error al hacer Fetch</Text> :
    //Caso del axios exitoso
    <>
    <ItemHistorial item={historial[0]}/>
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

