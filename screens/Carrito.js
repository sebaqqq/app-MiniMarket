import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import { db } from "../DB/firebase"; 
import { addDoc, collection, serverTimestamp, } from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome5";

const Carrito = ({ route, navigation }) => {
  const { carrito, setCarrito } = route.params;
  const [totalCompra, setTotalCompra] = useState(
    carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
  );


  const renderizarItemCarrito = ({ item }) => (
    <View style={styles.itemCarrito}>
      <Text style={styles.nombre}>{`Nombre: ${item.nombreProducto}`}</Text>
      <View style={styles.cantidadContainer}>
        <TouchableOpacity onPress={() => handleEliminarProducto(item.id)}>
          <Icon name="times" size={20} color="red" />
        </TouchableOpacity>
        <Text style={styles.detalle}>{`Cantidad: ${item.cantidad}`}</Text>
      </View>
      <Text style={styles.detalle}>{`Precio: $${item.precio
        .toFixed(2)
        .replace(/\.?0+$/, '')}`}</Text>
    </View>
  );

  const handleVaciarCarrito = () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que quieres vaciar el carrito?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Vaciar Carrito",
          onPress: () => {
            setTotalCompra(0);
            setCarrito([]); // Actualiza el estado del carrito
            navigation.navigate("carrito", { carrito: [] });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleRealizarVenta = async () => {
    try {
      if (!carrito) {
        console.error("Error al realizar la venta: Carrito no definido");
        return;
      }
      const ventaRef = await addDoc(collection(db, "ventas"), {
        productos: carrito,
        total: totalCompra.toFixed(2).replace(/\.?0+$/, ''), // Modificación aquí
        fechaHora: serverTimestamp(),
      });

      Alert.alert("Venta realizada", "La venta se ha registrado exitosamente.");

      setTotalCompra(0);
      setCarrito([]);
      navigation.navigate("carrito", { carrito: [] });
    } catch (error) {
      console.error("Error al realizar la venta:", error);
      Alert.alert("Error", "Hubo un error al realizar la venta. Por favor, inténtalo de nuevo.");
    }
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Lista", { carrito, setCarrito })}>
        <Text style={styles.volverLista}>Volver a la Lista</Text>
      </TouchableOpacity>

      <Text style={styles.tituloCarrito}>Carrito de Compras</Text>

      {carrito.length > 0 ? (
        <>
          <FlatList
            data={carrito}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderizarItemCarrito}
          />

          <Text style={[styles.total, { textAlign: "center" }]}>{`Total: $${totalCompra
            .toFixed(2)
            .replace(/\.?0+$/, '')}`}</Text>

          <View style={styles.botonesContainer}>
            <TouchableOpacity
              style={[styles.boton, { backgroundColor: "#ff0000" }]}
              onPress={handleVaciarCarrito}
            >
              <Text style={styles.botonTexto}>Vaciar Carrito</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.boton, { backgroundColor: "#007bff" }]}
              onPress={handleRealizarVenta}
            >
              <Text style={styles.botonTexto}>Realizar Venta</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.mensajeVacio}>El carrito está vacío</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  volverLista: {
    fontSize: 16,
    color: "#007bff",
    marginBottom: 8,
    textDecorationLine: "underline",
  },
  tituloCarrito: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  itemCarrito: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cantidadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detalle: {
    fontSize: 14,
    color: "#555",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  mensajeVacio: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },



  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  boton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  botonTexto: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },

});

export default Carrito;
