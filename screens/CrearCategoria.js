import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../DB/firebase";

const CrearCategoria = () => {
  const [categoria, setCategoria] = useState("");

  const handleChangeCategoria = (value) => {
    setCategoria(value);
  };

  const handleGuardarCategoria = async () => {
    try {
      if (!categoria) {
        Alert.alert(
          "Campo obligatorio",
          "Por favor, complete el campo de categoría."
        );
        return;
      }

      const nuevaCategoria = {
        nombreCategoria: categoria,
      };

      await addDoc(collection(db, "categorias"), nuevaCategoria);

      setCategoria("");

      Alert.alert(
        "Categoría creada",
        "La categoría se ha creado exitosamente."
      );
    } catch (error) {
      console.error("Error al guardar la categoría:", error);

      if (error.code === "permission-denied") {
        Alert.alert(
          "Error de permisos",
          "No tienes permisos para guardar la categoría."
        );
      } else {
        Alert.alert("Error", "Hubo un error al intentar guardar la categoría.");
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
      <TouchableOpacity onPress={handleGuardarCategoria} style={styles.boton}>
        <Text style={styles.botonText}>Guardar Categoría</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#D4D4D4",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 8,
    paddingLeft: 40,
    color: "#333",
    borderRadius: 10,
  },
  boton: {
    backgroundColor: "#1C2120",
    padding: 10,
    borderRadius: 8,
    width: "85%",
    alignItems: "center",
  },
  botonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CrearCategoria;
