import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/storage';
import { db } from "../DB/firebase";

const Historial = ({ navigation }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const historialSnapshot = await getDocs(collection(db, 'historialVentas'));
        const historialData = historialSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHistorial(historialData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener el historial de ventas:', error);
        setError('Error al obtener el historial de ventas');
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  const handleVerDetalles = (productos) => {
    navigation.navigate('DetallesProductos', { productos });
  };

  const renderizarItemVenta = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleVerDetalles(item.productos)}>
        <View style={styles.itemVenta}>
          <Text>{`Fecha y Hora: ${item.fechaHora ? item.fechaHora.toDate().toLocaleString() : 'N/A'}`}</Text>
          {item.productos && item.productos.length > 0 && (
            <View>
              <Text>Productos Vendidos:</Text>
              <FlatList
                data={item.productos}
                keyExtractor={(producto) => producto.id.toString()}
                renderItem={({ item: producto }) => (
                  <Text>{`${producto.nombre} - ${producto.precio}`}</Text>
                )}
              />
            </View>
          )}
          {typeof item.total === 'number' && !isNaN(item.total) && (
            <Text>{`Total: $${item.total.toFixed(2)}`}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Historial de Ventas</Text>
      <FlatList
        data={historial}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarItemVenta}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemVenta: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
});

export default Historial;
