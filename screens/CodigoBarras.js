import React, { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, View, Button, StyleSheet, Alert, ScrollView, Dimensions, RefreshControl } from 'react-native';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { db, auth } from "../DB/firebase";
import { getDoc, doc, collection, addDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const EscanerCodigoBarras = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [totalCompra, setTotalCompra] = useState(0);
    const [cameraActive, setCameraActive] = useState(true); // Estado para controlar si la cámara está activa o no
    const [cameraRef, setCameraRef] = useState(null); // Referencia a la cámara
    const [reloadKey, setReloadKey] = useState(0); // Clave para forzar la recarga de la cámara
    const [scanning, setScanning] = useState(true); // Estado para controlar si se está escaneando un producto
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar si se está refrescando la cámara

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
        if (!scanning) return;
    
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
                    return;
                }
    
                const nuevoProducto = { ...productoData, cantidad: 1 };
                setCarrito([...carrito, nuevoProducto]);
    
                playSound();
    
                setScanning(false);
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
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const userDoc = doc(db, 'users', userId);
                const userSnap = await getDoc(userDoc);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    const firstName = userData.firstName; 
                    console.log('Nombre del usuario:', firstName);
            
                    await addDoc(collection(db, 'historialVentas'), {
                        carrito,
                        totalCompra,
                        fecha: new Date().toISOString(),
                        usuario: { firstName }
                    });
            
                    setCarrito([]);
                    setTotalCompra(0);
            
                    Alert.alert('Compra finalizada');
                } else {
                    console.error('Usuario no encontrado');
                    Alert.alert('Usuario no encontrado');
                }
            } else {
                Alert.alert('Usuario no autenticado', 'Debes iniciar sesión para finalizar la compra.');
            }
    
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            Alert.alert('Error al finalizar la compra', 'Por favor, inténtalo de nuevo más tarde.');
        }
    };




    const toggleCamera = () => {
        setCameraActive(prevState => !prevState); // Cambiar el estado de la cámara sin desactivarla
        setReloadKey(prevKey => prevKey + 1); // Incrementar la clave para forzar la recarga de la cámara
    };
    
    const reloadCamera = () => {
        setScanning(true); // Volver a habilitar el escaneo
        setRefreshing(true); // Activar el indicador de actualización
        setReloadKey(prevKey => prevKey + 1); // Incrementar la clave para forzar la recarga de la cámara
    };
    

    const onRefresh = () => {
        reloadCamera();
        setTimeout(() => {
            setRefreshing(false); // Desactiva el indicador de actualización después de un breve retraso
        }, 1000);
    };

    if (hasPermission === null) {
        return <Text>Solicitando permiso de la cámara...</Text>;
    }
    if (hasPermission === false) {
        return <Text>Permiso de la cámara no concedido</Text>;
    }


    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                    />
                }
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.cameraContainer}>
                    <Camera
                        key={reloadKey} // Utilizar reloadKey como clave para forzar el remontaje
                        style={[StyleSheet.absoluteFillObject, styles.camera]}
                        onBarCodeScanned={handleBarCodeScanned}
                        type={Camera.Constants.Type.back}
                        autoFocus={Camera.Constants.AutoFocus.on}
                        flashMode={Camera.Constants.FlashMode.on}
                        ratio="3:3"
                        ref={cameraRef}
                    />

                    <View style={styles.scannerContainer}>
                        <View style={styles.scannerRect}></View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.actualizarButton} onPress={onRefresh}>
                            <Text style={styles.buttonText}>Actualizar Cámara</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actualizarButton} onPress={toggleCamera}>
                            <Text style={styles.buttonText}>Encender Cámara</Text>
                        </TouchableOpacity>
                    </View>


                </View>
    
                <ScrollView style={styles.carritoContainer}>
                    {carrito.map((producto) => (
                        <View key={producto.idProducto} style={styles.producto}>
                            <View style={styles.nombrePrecioContainer}>
                                <Text numberOfLines={2} ellipsizeMode="tail">producto: {producto.nombreProducto}</Text>
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
            </ScrollView>
        </View>
    );
    
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', // Centra horizontalmente en el contenedor principal
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        aspectRatio: 4/3,
    },
    cameraContainer: {
        aspectRatio: 4/3,
        width: '98%', // Ocupa todo el ancho disponible
        justifyContent: 'center', // Centra verticalmente en el contenedor de la cámara
        alignItems: 'center', // Centra horizontalmente en el contenedor de la cámara
        position: 'relative',
        borderRadius: 100,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%',
        marginBottom: '2%',
    },
    
    scannerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scannerRect: {
        width: Dimensions.get('window').width * 0.4, // Por ejemplo, el 90% del ancho de la ventana
        height: '25%',
        borderWidth: 3,
        borderColor: 'yellow',
        borderRadius: 10,
        opacity: 0.5,
    },
    actualizarButton: {
        backgroundColor: '#EDEDED', // Color de fondo del botón
        paddingHorizontal: 20, // Espaciado horizontal interno
        paddingVertical: 10, // Espaciado vertical interno
        marginBottom:'2%',
        borderRadius: 5, // Bordes redondeados
        opacity:0.7,
    },
    buttonText: {
        color: 'white', // Color del texto del botón
        textAlign: 'center', // Alineación del texto al centro
        fontWeight: 'bold', // Fuente en negrita
    },
    
    
    carritoContainer: {
        width: '100%', // Ocupa todo el ancho disponible
        marginVertical: 5,
    },
    producto: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor:'#EDEDED',
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
        padding: 8,
        borderRadius: 5,
        marginRight: 8,
        paddingHorizontal: 5, // Ajustar el ancho del botón
        alignItems: 'center', // Centrar horizontalmente el contenido
    },
    totalContainer: {
        width: '100%', // Ocupa todo el ancho disponible
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        padding: 10,
        alignItems: 'center',
    },
});

export default EscanerCodigoBarras;
