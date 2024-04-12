import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../DB/firebase";

const CrearCategoria = () => {
    const [categoria, setCategoria] = useState('');

    const handleChangeCategoria = (value) => {
        setCategoria(value);
    };

    const handleGuardarCategoria = async () => {
        try {
            if (!categoria) {
                Alert.alert('Campo obligatorio', 'Por favor, complete el campo de categoría.');
                return;
            }
    
            const nuevaCategoria = {
                nombreCategoria: categoria,
            };
    
            await addDoc(collection(db, 'categorias'), nuevaCategoria);
    
            setCategoria('');
    
            Alert.alert('Categoría creada', 'La categoría se ha creado exitosamente.');
        } catch (error) {
            console.error('Error al guardar la categoría:', error);
    
            if (error.code === 'permission-denied') {
                Alert.alert('Error de permisos', 'No tienes permisos para guardar la categoría.');
            } else {
                Alert.alert('Error', 'Hubo un error al intentar guardar la categoría.');
            }
        }
    };
    
    return (
        <View style={styles.container}>
            <Text>Ingrese el nombre de la categoría</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre de la categoría"
                value={categoria}
                onChangeText={handleChangeCategoria}
            />

            <Button title="Guardar Categoría" onPress={handleGuardarCategoria} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        height: 30,
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingLeft: 8,
        textAlignVertical: 'bottom',
        marginBottom: 16,
    },
});

export default CrearCategoria;
