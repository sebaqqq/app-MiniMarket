import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; 
import { db } from "../DB/firebase";
import {  collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { BarCodeScanner } from 'expo-barcode-scanner'; 
import Icon from "react-native-vector-icons/FontAwesome5";
import { Camera } from 'expo-camera';

const CAMERA_PERMISSION = 'camera';

const Lista = ({ route }) => {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [productoExpandido, setProductoExpandido] = useState(null);
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  const { carrito: carritoEnLista, setCarrito: setCarritoEnLista } = route.params || {};
  const [carrito, setCarrito] = useState(carritoEnLista || []);
  const [hasPermission, setHasPermission] = useState(null); // Nuevo estado para los permisos de la cámara



  useEffect(() => {
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

    obtenerProductos();
  }, [filtro]); 


  const handleEscanearCodigoBarras = () => {
    setScanning(true);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    setFiltro(data);
  };


  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        console.log('Status de permiso:', status);
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Error al solicitar permisos de la cámara:', error);
      }
    })();
  }, []);
  


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


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

  const handleActualizarProducto = (producto) => {
    navigation.navigate('ActualizarLista');
  };

  const handlePresionarProducto = (id) => {
    setProductoExpandido((prevProductoExpandido) => 
      prevProductoExpandido === id ? null : id
    );
  };


  const handleAgregarAlCarrito = (producto) => {
    try {
      // Actualizar el estado local del carrito
      setCarrito((prevCarrito) => [...prevCarrito, { ...producto, cantidad: 1 }]);
  
      // Mostrar un mensaje de éxito
      console.log("Producto añadido al carrito:", producto);
      Alert.alert("Agregado al carrito", `${producto.nombreProducto} ha sido añadido al carrito`);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      // Puedes mostrar una alerta de error específica si es necesario
      Alert.alert("Error", "Hubo un error al agregar el producto al carrito. Por favor, inténtalo de nuevo.");
    }
  };
  
  const handleNavegarACarrito = () => {
    navigation.navigate("carrito", { carrito, setCarrito }); // Pass setCarrito as a prop
  };

  const handleActualizarCantidad = (productId, newQuantity) => {
    const updatedCarrito = carrito.map((item) =>
      item.id === productId ? { ...item, cantidad: newQuantity } : item
    );

    setCarrito(updatedCarrito);

    const newTotalCompra = updatedCarrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );

    setTotalCompra(newTotalCompra);

    // Actualiza las opciones de navegación con el nuevo carrito
    navigation.setOptions({
      params: { carrito: updatedCarrito, setCarrito: setCarritoEnLista },
    });
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
                style={styles.botonAgregarCarrito}
                onPress={() => handleAgregarAlCarrito(item)}
              >
                <Icon name="cart-plus" size={20} color="#fff" />
              </TouchableOpacity>

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


  

  if (loading) {

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.botonesContainerInicio}>

        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("Historial")}>
          <Text style={styles.textoBoton}>Ver Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.boton} onPress={handleNavegarACarrito}>
          <Icon name="shopping-cart" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
  filtroInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderBottomRightRadius: 10, 
    borderTopRightRadius: 10,

  },


botonesContainerInicio: {
  flexDirection: 'row',
  justifyContent: 'space-around', // Ajusta el espacio entre los botones
  marginBottom: 20,
},
boton: {
  backgroundColor: '#3498db',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
},
textoBoton: {
  color: 'white',
  fontSize: 14,
  fontWeight: 'bold',
},


botonesContainer: {
  flexDirection: "row",
  marginVertical: 8, // Cambia marginTop a marginVertical
},
botonAgregarCarrito: {
  backgroundColor: "#007bff",
  padding: 5,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  paddingHorizontal: 10,
  marginRight: 8,
  maxWidth: 100, // Agrega un ancho máximo según sea necesario
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
  maxWidth: 100, // Agrega un ancho máximo según sea necesario
},
botonEliminar: {
  backgroundColor: "#ff0000",
  padding: 5,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  paddingHorizontal: 10,
  maxWidth: 100, // Agrega un ancho máximo según sea necesario
},



  botonCarrito: {
    backgroundColor: "#007bff", 
    padding: 5,
    borderRadius: 10,
    alignItems: "center",    
    justifyContent: "center",
  },


  botonHistorial: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  textoBotonHistorial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },


  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonEscanear: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  textoBoton: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
});

export default Lista;