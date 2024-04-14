import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Alert, ScrollView, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { db } from "../DB/firebase";
import { getDoc, doc, collection, addDoc  } from "firebase/firestore";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const EscanerCodigoBarras = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [totalCompra, setTotalCompra] = useState(0);
    const [cameraActive, setCameraActive] = useState(true);
    const [productoEnCarrito, setProductoEnCarrito] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        calcularTotal();
    }, [carrito]);

    const calcularTotal = () => {
        const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        setTotalCompra(total.toFixed(0)); 
    }

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../sound/beep.mp3')
            );
            await sound.playAsync();
        } catch (error) {
            console.error('Error al reproducir el sonido:', error);
        }
    };

    const handleBarCodeScanned = async ({ type, data }) => {
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
                const existingProductIndex = carrito.findIndex(item => item.idProducto === productoData.idProducto);
                if (existingProductIndex !== -1) {
                    setProductoEnCarrito(productoData.idProducto);
                    return;
                }

                const nuevoProducto = { ...productoData, cantidad: 1 };
                setCarrito([...carrito, nuevoProducto]);
                
                playSound();
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
        setCarrito(carrito.filter(item => item.idProducto !== productId));
    };

    const actualizarCantidad = (productId, nuevaCantidad) => {
        const nuevoCarrito = carrito.map(item => {
            if (item.idProducto === productId) {
                return { ...item, cantidad: nuevaCantidad };
            }
            return item;
        });
        setCarrito(nuevoCarrito);
    };
 
    const finalizarCompra = async () => {
        if (carrito.length === 0) {
            Alert.alert('Carrito vacío', 'Agrega al menos un producto al carrito antes de finalizar la compra.');
            return;
        }
    
        try {
            await addDoc(collection(db, 'historialVentas'), {
                carrito,
                totalCompra,
                fecha: new Date().toISOString(),
            });
    
            setCarrito([]);
            setTotalCompra(0);
    
            Alert.alert('Compra finalizada');
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            Alert.alert('Error al finalizar la compra', 'Por favor, inténtalo de nuevo más tarde.');
        }
    };

    const toggleCamera = () => {
        setCameraActive(!cameraActive);
    };

    if (hasPermission === null) {
        return <Text>Solicitando permiso de la cámara...</Text>;
    }
    if (hasPermission === false) {
        return <Text>Permiso de la cámara no concedido</Text>;
    }

    return (
        <View style={styles.container}>
            {cameraActive && (
                <View style={styles.cameraContainer}>
                    <Camera
                        style={[StyleSheet.absoluteFillObject, styles.camera]}
                        onBarCodeScanned={handleBarCodeScanned}
                        type={Camera.Constants.Type.back}
                        autoFocus={Camera.Constants.AutoFocus.on}
                        flashMode={Camera.Constants.FlashMode.off}
                        ratio="4:3"
                    />
                    <View style={styles.scannerRect}></View>
                </View>
            )}
            <Button title={cameraActive ? 'Desactivar Cámara' : 'Activar Cámara'} onPress={toggleCamera} />
            <Text>Productos en el carrito: {carrito.length}</Text>
            <ScrollView style={styles.carritoContainer}>
            {carrito.map((producto) => (
                <View key={producto.id} style={[styles.producto, productoEnCarrito === producto.idProducto && { backgroundColor: 'yellow' }]}>
                    <View style={styles.nombrePrecioContainer}>
                        <Text numberOfLines={2} ellipsizeMode="tail">{producto.nombreProducto}</Text>
                        <Text>Precio: ${producto.precio.toFixed(0)}</Text>
                    </View>
                    <View style={styles.cantidadEliminarContainer}>
                        <View style={styles.cantidadContainer}>
                            <Button title={'-'} onPress={() => actualizarCantidad(producto.idProducto, Math.max(producto.cantidad - 1, 0))} />
                            <Text style={styles.cantidadText}>{producto.cantidad}</Text>
                            <Button title={'+'} onPress={() => actualizarCantidad(producto.idProducto, producto.cantidad + 1)} />
                        </View>
                        {producto.cantidad === 0 && (
                            <MaterialCommunityIcons name="delete-outline" size={20} color="white" style={styles.iconoEliminar} onPress={() => removeFromCart(producto.idProducto)} />
                        )}
                    </View>
                </View>
            ))}
            </ScrollView>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: ${totalCompra}</Text>
                <Button title={'Finalizar Compra'} onPress={finalizarCompra} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    camera: {
        aspectRatio: 4/3,
    },
    cameraContainer: {
        flex: 1,
        aspectRatio: 4/3,
        height: Dimensions.get('window').height * 0.5,
        position: 'relative',
    },
    scannerRect: {
        position: 'absolute',
        top: '25%',
        left: '10%',
        width: '80%',
        height: '50%',
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 10,
        opacity: 0.5,
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
    cantidadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cantidadText: {
        paddingHorizontal: 16,
    },
    totalText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    iconoEliminar: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        margin:10,
    },
    totalContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        padding: 10,
        alignItems: 'center',
    },
});

export default EscanerCodigoBarras;

