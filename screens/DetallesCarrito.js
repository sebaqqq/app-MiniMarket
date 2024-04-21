import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { db } from "../DB/firebase";
import { doc, getDoc } from "firebase/firestore";

const DetallesCarrito = ({ route }) => {
  const { carritoId } = route.params;
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const carritoDoc = doc(db, "historialVentas", carritoId);
        const carritoSnapshot = await getDoc(carritoDoc);
        if (carritoSnapshot.exists()) {
          const data = carritoSnapshot.data();
          setCarrito({
            ...data,
            productos: data.carrito || [],
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", options);
  };

  const formatId = (idString) => {
    return idString.match(/.{1,4}/g).join("-");
  };

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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Detalles del Carrito</Text>
        <Text>ID: {formatId(carritoId)}</Text>
        <Text>Fecha: {formatDate(carrito.fecha)}</Text>
        {carrito.productos.length > 0 && (
          <View style={styles.productContainer}>
            <Text style={styles.productTitle}>Productos:</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Código Producto</Text>
                <Text style={styles.tableCell}>Cantidad</Text>
                <Text style={styles.tableCell}>Nombre Producto</Text>
              </View>
              {carrito.productos.map((producto, index) => (
                <View
                  style={[
                    styles.tableRow,
                    index === carrito.productos.length - 1 &&
                      styles.lastTableRow,
                  ]}
                  key={index}
                >
                  <Text style={styles.tableCell}>{producto.idProducto}</Text>
                  <Text style={styles.tableCell}>{producto.cantidad}</Text>
                  <Text style={styles.tableCell}>
                    {producto.nombreProducto}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
        <Text>Total Compra: {carrito.totalCompra}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  productContainer: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    textAlign: "center",
    padding: 8,
  },
  lastTableRow: {
    borderBottomWidth: 0,
  },
});

export default DetallesCarrito;
