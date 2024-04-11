import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { db } from "../DB/firebase";
import { collection, getDocs } from 'firebase/firestore';

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPorFecha, setTotalPorFecha] = useState({});

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const historialCollection = collection(db, 'historialVentas');
        const historialSnapshot = await getDocs(historialCollection);
        const historialData = historialSnapshot.docs.map(doc => {
          const data = doc.data();
          // Convierte el campo totalCompra de string a number
          const totalCompra = parseFloat(data.totalCompra);
          return {
            id: doc.id,
            ...data,
            totalCompra: isNaN(totalCompra) ? 0 : totalCompra // Si es NaN, asigna 0
          };
        });
        setHistorial(historialData);
        setLoading(false);
        calcularTotalPorFecha(historialData);
      } catch (error) {
        console.error("Error fetching historial:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  // Función para calcular el total de compras por fecha
  const calcularTotalPorFecha = (historialData) => {
    const totalPorFecha = {};
    historialData.forEach(item => {
      const fecha = formatFecha(item.fecha);
      totalPorFecha[fecha] = (totalPorFecha[fecha] || 0) + item.totalCompra;
    });
    setTotalPorFecha(totalPorFecha);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>ID: {item.id}</Text>
      <Text>Fecha: {formatFecha(item.fecha)}</Text>
      <Text>Total Compra: {item.totalCompra}</Text>
    </View>
  );

  const formatFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={historial}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total por Día:</Text>
        {Object.keys(totalPorFecha).map(fecha => (
          <Text key={fecha}>{fecha}: {totalPorFecha[fecha]}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width:350,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  totalContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 15,
  }
});

export default Historial;
