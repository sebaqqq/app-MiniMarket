import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { db } from "../DB/firebase";
import { collection, getDocs } from 'firebase/firestore';

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const historialCollection = collection(db, 'historialVenta');
        const historialSnapshot = await getDocs(historialCollection);
        const historialData = historialSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHistorial(historialData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching historial:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>ID: {item.id}</Text>
      <Text>Fecha: {item.fecha}</Text>
      <Text>Total Compra: {item.totalCompra}</Text>
    </View>
  );

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
    <FlatList
      data={historial}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
});

export default Historial;
