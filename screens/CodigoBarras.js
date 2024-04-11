import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Camera } from 'expo-camera';
import { db } from "../DB/firebase";
import { getDoc, doc } from "firebase/firestore";
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
                    size={26}
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
        aspectRatio: 1, // Hace que el contenedor mantenga una relación de aspecto de 1:1
        height: Dimensions.get('window').height * 4, // La cámara ocupará la mitad del alto de la pantalla
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
