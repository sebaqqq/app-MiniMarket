import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { db } from "../DB/firebase";
import { getDoc, doc } from "firebase/firestore";
import CarritoCompra from "./Carrito";

const EscanerCodigoBarras = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [producto, setProducto] = useState(null);
    const [codigoBarras, setCodigoBarras] = useState(null);
    const [carrito, setCarrito] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        setCodigoBarras(data);

        try {
            const productoDoc = doc(db, "productos", data);
            const productoSnap = await getDoc(productoDoc);

            if (!productoSnap.exists()) {
                console.log("Producto no encontrado");
                Alert.alert("Producto no encontrado");
                return;
            }

            const productoData = productoSnap.data();
            setProducto(productoData);
            setCarrito([...carrito, productoData]);
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
            <Camera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            {scanned && <Button title={'Escanear de nuevo'} onPress={() => {
                setScanned(false);
                setCodigoBarras(null);
            }} />}
            <Text>Productos en el carrito: {carrito.length}</Text>
            <Button title="Ver carrito" onPress={() => console.log(carrito)} />
            <CarritoCompra carrito={carrito} removeFromCart={removeFromCart} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    camera: {
        flex: 1,
    },
});

export default EscanerCodigoBarras;
