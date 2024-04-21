import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../DB/firebase";
import { LoginStyles } from "../styles/LoginEstilo";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmailSent(true);
      })
      .catch((error) => {
        Alert.alert("Error", "No se pudo enviar el correo electrónico de restablecimiento de contraseña.");
      });
  };

  return (
    
    <View style={LoginStyles.container}>
      <View style={LoginStyles.centeredContainer}>
  
        <Image 
        source={require("../images/panda_recuperar.png")} 
        style={{ marginTop: -200 }} // Cambia el valor de marginTop según sea necesario
        />        
          <Text style={LoginStyles.title}>Olvidaste</Text>
          <Text style={LoginStyles.headerTextrecuperar}>tu Contraseña?</Text>

        <Text style={{ marginTop:10, marginBottom:10 }}>ingresa tu correo para recupeararla</Text>
        <TextInput
          placeholder="Correo electrónico"
          style={LoginStyles.inputRecupear}
          onChangeText={(text) => setEmail(text)}
          value={email}
          keyboardType="email-address"
        />
        
        <TouchableOpacity
          style={LoginStyles.loginButton}
          onPress={handleForgotPassword}
        >
          <Text style={LoginStyles.buttonText}>Restablecer contraseña</Text>
        </TouchableOpacity>
        {emailSent && (
          <Text style={LoginStyles.successText}>Se ha enviado un correo electrónico de restablecimiento de contraseña a {email}. Por favor, revisa tu bandeja de entrada.</Text>
        )}
        
      </View>
    </View>






  );
};

export default ForgotPassword;
