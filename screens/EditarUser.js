import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  ScrollView
} from "react-native";
import { 
  doc, 
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../DB/firebase";
import { updatePassword as updateFirebasePassword } from "firebase/auth";
import { EditarUserStyles } from "../styles/EditarUserEstilo";

const EditarUser = () => {
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newApellido, setNewApellido] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newTelefono, setNewTelefono] = useState("");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const identifyUser = auth.currentUser;
  
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      onSnapshot(userRef, (snapshot) => {
        const userData = snapshot.data();
        setUserData(userData);
        setNewName(userData.firstName || "");
        setNewApellido(userData.lastName || "");
        setNewPassword(userData.password || "");
        setNewTelefono(userData.phone || "");
        setLoading(false);
      });
    }
  }, []);

  const actualizarDatosUsuario = async () => {
    try {
      const identifyUser = auth.currentUser;
  
      if (identifyUser) {
        const userDocRef = doc(db, "users", identifyUser.uid);
  
        const updatedUserData = {
          nombre: newName || userData.firstName,
          apellido: newApellido || userData.lastName,
          telefono: newTelefono || userData.phone,
          password: newPassword || userData.password,
        };
  
        await setDoc(userDocRef, updatedUserData, { merge: true });
  
        if (newPassword) {
          await updateFirebasePassword(identifyUser, newPassword);
          console.log("Contraseña actualizada con éxito");
        }
  
        console.log("Datos del usuario actualizados con éxito");
        Alert.alert("Datos del usuario actualizados con éxito");
      }
    } catch (error) {
      console.error("Error al actualizar datos del usuario:", error);
      Alert.alert("Error al actualizar datos del usuario:", error);
    }
  };

  if (loading) {
    return (
      <View style={EditarUserStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077B6" />
        <Text style={EditarUserStyles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={EditarUserStyles.container}>
        <Text style={EditarUserStyles.textTitle}>Editar Usuario</Text>
        <Text style={EditarUserStyles.text}>Nombre</Text>
        <TextInput
          style={EditarUserStyles.input}
          placeholder="Nombre"
          value={newName}
          onChangeText={(text) => setNewName(text)}
        />
        <Text style={EditarUserStyles.text}>Apellido</Text>
        <TextInput
          style={EditarUserStyles.input}
          placeholder="Apellido"
          value={newApellido}
          onChangeText={(text) => setNewApellido(text)}
        />
        <Text style={EditarUserStyles.text}>Contraseña</Text>
        <TextInput
          style={EditarUserStyles.input}
          placeholder="Contraseña"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <Text style={EditarUserStyles.text}>Teléfono</Text>
        <TextInput
          style={EditarUserStyles.input}
          placeholder="Teléfono"
          value={newTelefono}
          onChangeText={(text) => setNewTelefono(text)}
        />
        <TouchableOpacity onPress={actualizarDatosUsuario} style={EditarUserStyles.boton}>
          <Text style={EditarUserStyles.botonText}>Actualizar Datos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditarUser;