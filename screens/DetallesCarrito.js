import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from 'react-native';
import { db } from "../DB/firebase";
import { doc, getDoc } from 'firebase/firestore';

const DetallesCarrito = ({ route }) => {
  const { carritoId } = route.params;
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const carritoDoc = doc(db, 'historialVentas', carritoId);
        const carritoSnapshot = await getDoc(carritoDoc);
        if (carritoSnapshot.exists()) {
          const data = carritoSnapshot.data();
          setCarrito({
            ...data,
            productos: data.carrito || []  
          });
        } else {
          setError("El carrito no existe");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching carrito:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchCarrito();
  }, [carritoId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando detalles del carrito...</Text>
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

  if (!carrito) {
    return (
      <View style={styles.container}>
        <Text>El carrito no existe</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Carrito</Text>
      <Text>ID: {carritoId}</Text>
      <Text>Fecha: {carrito.fecha}</Text>
      {carrito.productos.length > 0 && (
        <View style={styles.productContainer}>
          <Text style={styles.productTitle}>Productos:</Text>
          <Text style={styles.productHeader}>Código Producto | Nombre Producto</Text>
          {carrito.productos.map((producto, index) => (
            <Text style={styles.productItem} key={index}>{`${producto.idProducto} | ${producto.nombreProducto}`}</Text>
          ))}
        </View>
      )}
      <Text>Total Compra: {carrito.totalCompra}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productContainer: {
    marginTop: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productItem: {
    marginLeft: 20,
  },
  productHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default DetallesCarrito;
