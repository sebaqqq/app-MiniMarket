import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { db } from "../DB/firebase";
import { getDoc, doc } from "firebase/firestore";

const EscanerCodigoBarras = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [carrito, setCarrito] = useState([]);
    const [totalCompra, setTotalCompra] = useState(0);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        calcularTotal();
    }, [carrito]);

    const calcularTotal = () => {
        const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
        setTotalCompra(total.toFixed(0)); // Redondea el total hacia abajo y lo convierte en un número entero
    };

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
            <ScrollView style={styles.carritoContainer}>
                {carrito.map((producto, index) => (
                    <View key={index} style={styles.producto}>
                        <Text>{producto.nombreProducto}</Text>
                        <Text>Precio: ${producto.precio.toFixed(0)}</Text>
                        <Button title={'Eliminar'} onPress={() => removeFromCart(producto.id)} />
                    </View>
                ))}
            </ScrollView>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: ${totalCompra}</Text>
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
        height: Dimensions.get('window').height * 0.5,
    },
    camera: {
        flex: 1,
    },
    carritoContainer: {
        maxHeight: 200,
        marginVertical: 10,
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
    totalContainer: {
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    totalText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EscanerCodigoBarras;
