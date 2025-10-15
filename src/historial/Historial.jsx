import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useAuth } from '../auth/AuthProvider'


export default function Historial() {
  const { user, token } = useAuth();

    const [turnos, setTurnos] = useState ([])


  useEffect(()=>{
    fetch("http://localhost:9090/api/reservas/usuario/" + user.id,{
      method: "GET",
      headers:{
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
    .then (respuesta => respuesta.json())
    .then (datos=> {
      setTurnos(datos)
      console.log(datos)
      const fetchSede = datos.map(item=>
        fetch('http://localhost:9090/api/clases/'+item.idClase,{
          method: "GET",
          headers:{
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
          },
        })
        .then(res => res.json())
        .then(detalle =>({
          ...item,
          disiplina: detalle.disciplina,
          idSede: detalle.idSede
        }))
      )
      return Promise.all(fetchSede)
    })
    .then((historial)=>{
      const promesasSedes = historial.map(item=>
        fetch("http://localhost:9090/api/sedes/"+item.idSede,{
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
          }
        })
        .then(res => res.json())
        .then(sede =>({
          ...item,
          nombreSede: sede.nombre,
          ubicacion: sede.ubicacion,
          barrioSede: sede.barrio
        }))
      )
      return Promise.all(promesasSedes)
    })
    .then(listaCompleta=>{
      setTurnos(listaCompleta)
      console.log(listaCompleta)
    })

  },[])


  return (
    <>
    <View style={estilos.container}> 
      <Text style={estilos.headerTitle}>Historial de turnos</Text>
      <View style={{borderColor:"black", width:"100%", border:"solid", borderWidth:"1px"}}></View>         
      <FlatList
      contentContainerStyle={estilos.contenedorHistorial}
      data={turnos}
      renderItem={({item})=>{
        return(
          <View style = {estilos.tarjeta}>
            <Text> Clase: {item.disiplina}</Text>
            <Text> Horario creacion: {item.timestampCreacion}</Text>
            <Text> ESTADO: {item.estado}</Text>
            <Text> Sede de la clase: {item.barrioSede}</Text>
            <Text> Ubicacion: {item.ubicacion}</Text>
          </View>
        )
      }}
      />
    </View>
    </>
  )
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fc", padding: 14 },

  tarjeta: {
    borderRadius: 16,
    Width: "100%",
    minHeight: 150,
    height: "auto",
    backgroundColor: '#ffffffff',
    padding: 10,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1c1c1e",
    textAlign: "center",
  },

  contenedorHistorial: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "stretch",
    gap: 12,            
    padding: 16,
  }
})
