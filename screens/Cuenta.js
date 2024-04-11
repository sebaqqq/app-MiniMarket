import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Image 
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { CuentaStyles } from "../styles/CuentaEstilo";
import { db, auth } from "../DB/firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

function Perfil() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const identifyUser = auth.currentUser;
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      onSnapshot(userRef, (snapshot) => {
        setUser(snapshot.data());
        setLoading(false);
      });
    }
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
        Alert.alert("Cuenta cerrada");
      })
      .catch((error) => alert(error.message));
  };

  if (loading) {
    return (
      <View style={CuentaStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0077B6" />
        <Text style={CuentaStyles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={CuentaStyles.container}>
      <View style={CuentaStyles.header}>
        <Text style={CuentaStyles.logo}>Montino</Text>
        <View style={CuentaStyles.buttonContainer}>
          <TouchableOpacity
            style={CuentaStyles.iconButton}
            onPress={() => navigation.navigate("Editar Usuario")}
          >
            <MaterialIcons name="settings" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={CuentaStyles.iconButton} onPress={handleSignOut}>
            <MaterialIcons name="exit-to-app" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {!user ? (
        <Text>No hay datos</Text>
      ) : (
        <View style={CuentaStyles.profile}>
          <Text style={CuentaStyles.subtitle}>Credencial de Usuario</Text>
          {/* <Image
            source={require("../images/AutoSinFondo.png")}
            style={CuentaStyles.logoImage}
          /> */}
          {renderProfileInfo("user", `${user.firstName} ${user.lastName}`)}
          {renderProfileInfo("envelope-o", user.email)}
        </View>
      )}
    </View>
  );
}

const renderProfileInfo = (iconName, text) => (
  <View style={CuentaStyles.section}>
    <View style={CuentaStyles.iconTextContainer}>
      <FontAwesome name={iconName} size={20} color="#0077B6" />
    </View>
    <Text style={CuentaStyles.text}>{text}</Text>
  </View>
);

export default Perfil;
