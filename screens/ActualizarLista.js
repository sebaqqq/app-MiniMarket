import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../DB/firebase";
import { doc,updateDoc } from 'firebase/firestore';

const ActualizarLista = ({ route }) => {
    const { id } = route.params.producto;
    const [nuevaCategoria, setNuevaCategoria] = useState(route.params.producto.categoria);
    const [nuevoNombre, setNuevoNombre] = useState(route.params.producto.nombreProducto);
    const [nuevoPrecio, setNuevoPrecio] = useState(`${route.params.producto.precio}`);
    const [nuevoPrecioOferta, setNuevoPrecioOferta] = useState(`${route.params.producto.precioOferta}`);
    const navigation = useNavigation();

    const handleActualizarProducto = async () => {
        try {
            const nuevosValores = {
                categoria: nuevaCategoria,
                nombreProducto: nuevoNombre,
                precio: parseFloat(nuevoPrecio),
                precioOferta: parseFloat(nuevoPrecioOferta), 
            };

            await updateDoc(doc(db, "productos", id), nuevosValores);

            navigation.goBack();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre del Producto:</Text>
            <TextInput
                style={styles.input}
                value={nuevoNombre}
                onChangeText={(text) => setNuevoNombre(text)}
            />
        <Text style={styles.label}>Categoría:</Text>
        <TextInput
            style={styles.input}
            value={nuevaCategoria}
            onChangeText={(text) => setNuevaCategoria(text)}
        />
        <Text style={styles.label}>Precio:</Text>
        <TextInput
            style={styles.input}
            value={nuevoPrecio}
            onChangeText={(text) => setNuevoPrecio(text)}
            keyboardType="numeric"
        />
        <Text style={styles.label}>Precio de Oferta:</Text>
        <TextInput
            style={styles.input}
            value={nuevoPrecioOferta}
            onChangeText={(text) => setNuevoPrecioOferta(text)}
            keyboardType="numeric"
        />
        <Button title="Actualizar Producto" onPress={handleActualizarProducto} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});

export default ActualizarLista;
