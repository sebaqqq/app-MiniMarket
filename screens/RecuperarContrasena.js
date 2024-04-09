import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
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
      <Text style={LoginStyles.title}>Hans Motors</Text>
      <Text style={LoginStyles.headerText}>Olvidé mi contraseña</Text>
      <TextInput
        placeholder="Correo electrónico"
        style={LoginStyles.input}
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
  );
};

export default ForgotPassword;
