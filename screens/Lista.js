import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native"; 
import { db } from "../DB/firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import Icon from "react-native-vector-icons/FontAwesome5";

const Lista = () => {
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [productoExpandido, setProductoExpandido] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const obtenerProductos = async () => {
    try {
      const productosCollection = collection(db, "productos");
      let queryProductos = productosCollection;

      if (filtro) {
        queryProductos = query(
          productosCollection,
          where("nombreProducto", ">=", filtro),
          where("nombreProducto", "<=", filtro + '\uf8ff')
        );
      }

      const productosSnapshot = await getDocs(queryProductos);
      const listaProductos = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(listaProductos);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await obtenerProductos();
    setRefreshing(false);
  };

  useEffect(() => {
    obtenerProductos();
  }, [filtro]);

  const handleEliminarProducto = async (id) => {
    try {
      Alert.alert(
        "Confirmar",
        "¿Estás seguro de que quieres eliminar este producto?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: async () => {
              await deleteDoc(doc(db, "productos", id));
              const nuevosProductos = productos.filter((producto) => producto.id !== id);
              setProductos(nuevosProductos);
              if (productoExpandido === id) {
                setProductoExpandido(null);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handlePresionarProducto = (id) => {
    setProductoExpandido((prevProductoExpandido) => 
      prevProductoExpandido === id ? null : id
    );
  };

  const renderizarItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handlePresionarProducto(item.id)}>
        <View style={styles.textoContainer}>
          <Text style={styles.nombre}>{`Nombre: ${item.nombreProducto}`}</Text>
          <Text style={styles.detalle}>{`Categoría: ${item.categoria}`}</Text>
          <Text style={styles.detalle}>{`Precio/u: ${item.precio}`}</Text>
          {productoExpandido === item.id && (
            <View style={styles.botonesContainer}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => navigation.navigate('ActualizarLista', { producto: item })}
              >
                <Icon name="pen" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => handleEliminarProducto(item.id)}
              >
                <Icon name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filtrosContainer}>
        <View style={styles.filtroIcono}>
          <Icon name="search" size={20} color="#555" />
        </View>
        <TextInput
          style={styles.filtroInput}
          placeholder="Nombre del producto o Categoría"
          value={filtro}
          onChangeText={setFiltro}
        />
      </View>
      <Text style={styles.tituloLista}>Lista de Productos</Text>
      <FlatList
        ref={scrollViewRef}
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={renderizarItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textoContainer: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detalle: {
    fontSize: 14,
    color: "#555",
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filtroInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 8,
    paddingLeft: 8,
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  filtroIcono: {
    justifyContent: "center",
    paddingRight: 8,
    padding: 8, 
    borderColor: 'gray',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10, 
    borderWidth: 1,
  },
  botonesContainer: {
    flexDirection: "row",
    marginVertical: 8, 
  },
  botonActualizar: {
    backgroundColor: "#28a745",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 10,
    marginRight: 8,
    maxWidth: 100, 
  },
  botonEliminar: {
    backgroundColor: "#ff0000",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 10,
    maxWidth: 100, 
  },
});

export default Lista;
