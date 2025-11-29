import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useTheme } from '../config/theme';

export default function ItemHistorial({ item = null }) {
  const { theme } = useTheme();

  //cambia el fondo de acuerdo al estado
  function fondo(item) {
    if (item.estado == 'CONFIRMADA') {
      return { backgroundColor: '#4A90E2' };
    } else if (item.estado == 'CANCELADA') {
      return { backgroundColor: '#d6604bff' };
    } else if (item.estado == 'EXPIRADA') {
      return { backgroundColor: '#ccc' };
    } else return { backgroundColor: theme.colors.surface };
  }

  if (item == null) {
    return (
      <>
        <View style={styles.card}>
          <Text>Tarjeta Vacia</Text>
        </View>
      </>
    );
  } else {
    return (
      <>
        <View style={[styles.card, fondo(item)]}>
          <View style={styles.fila}>
            <Text style={styles.textoTitulo}>{item.disiplina}</Text>
            <Text style={styles.textoCode}>Id:{item.id}</Text>
          </View>
          <View style={styles.separador}></View>
          <Text>Dia: {item.fecha}</Text>
          <Text>
            Horario Inicio: {item.horarioInicio.substring(0, 5)} - Horario Fin:{' '}
            {item.horarioFin.substring(0, 5)}
          </Text>
          <Text>
            Sede: {item.sede} - Barrio: {item.barrio}
          </Text>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,
    elevation: 5,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoTitulo: {
    fontWeight: '600',
    color: '#111',
    fontSize: 18,
  },
  textoCode: {
    fontWeight: '500',
    color: '#333',
    fontSize: 12,
  },
  separador: {
    width: '100%',
    height: 1,
    backgroundColor: '#000000ff',
    marginVertical: 12,
    alignSelf: 'stretch',
  },
});
