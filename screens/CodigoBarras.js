import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { db } from "../DB/firebase";
import { getDoc, doc, collection, addDoc } from "firebase/firestore";
import { Fontisto } from '@expo/vector-icons';

const EscanerCodigoBarras = () => {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [carrito, setCarrito] = useState([]);

    React.useLayoutEffect(() => {
        navigation.setOptions({ 
            headerRight: () => (
                <Fontisto
                    name="history"
                    size={23}
                    right={20}
                    color="#0077B6"
                    onPress={() => navigation.navigate('Historial')}
                />
            ),
        });
    }, [navigation]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
    
        try {
            const productoDoc = doc(db, "productos", data);
            const productoSnap = await getDoc(productoDoc);
    
            if (!productoSnap.exists()) {
                console.log("Producto no encontrado");
                Alert.alert("Producto no encontrado");
                return;
            }
    
            const productoData = productoSnap.data();
            if (productoData) {
                setCarrito([...carrito, productoData]);
            } else {
                console.log("Error: el documento del producto está vacío");
                Alert.alert("Error: el documento del producto está vacío");
            }
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            Alert.alert("Error al obtener el producto");
        }
    };

    const removeFromCart = (productId) => {
        setCarrito(carrito.filter(item => item.id !== productId));
    };

    if (hasPermission === null) {
        return <Text>Solicitando permiso de la cámara...</Text>;
    }
    if (hasPermission === false) {
        return <Text>Permiso de la cámara no concedido</Text>;
    }

    const finalizarVenta = async () => {
        try {
            const historialVentasRef = collection(db, 'historialVentas');
            await Promise.all(carrito.map(async (producto) => {
                await addDoc(historialVentasRef, producto);
            }));
            setCarrito([]); // Limpiar el carrito después de guardar los productos
            Alert.alert('Venta finalizada', 'Los productos han sido guardados en el historial de ventas.');
        } catch (error) {
            console.error('Error al finalizar la venta:', error);
            Alert.alert('Error', 'Ocurrió un error al finalizar la venta. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <Camera
                    style={styles.camera}
                    type={Camera.Constants.Type.back}
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
            </View>
            {scanned && <Button title={'Escanear de nuevo'} onPress={() => setScanned(false)} />}
            <Text>Productos en el carrito: {carrito.length}</Text>
            <View>
                {carrito.map((producto, index) => (
                    <View key={index} style={styles.producto}>
                        <Text>{producto.nombreProducto}</Text>
                        <Text>Precio: ${Math.floor(producto.precio)}</Text>
                        <Button title={'Finalizar Venta'} onPress={finalizarVenta} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    cameraContainer: {
        flex: 1,
        aspectRatio: 1, 
        height: Dimensions.get('window').height * 4, 
    },
    camera: {
        flex: 1,
    },
    producto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default EscanerCodigoBarras;
