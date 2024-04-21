import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../DB/firebase";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LoginStyles } from "../styles/LoginEstilo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Correo o Contraseña incorrectos");
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Election");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={LoginStyles.container}
    >
      <ScrollView
        contentContainerStyle={LoginStyles.scrollViewContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={LoginStyles.centeredContainer}>
          <View style={LoginStyles.headerContainer}>
            <Text style={LoginStyles.title}>
              Panda<Text style={LoginStyles.Subtitle}>Buy</Text>
            </Text>
            <Image
              source={require("../images/panda_sin.png")}
              style={LoginStyles.logoImage}
            />
          </View>

          <Text style={LoginStyles.headerText}>Iniciar Sesión</Text>

          <View style={LoginStyles.inputContainer}>
            <View style={LoginStyles.inputWrapper}>
              <Icon
                name="envelope"
                size={20}
                color="#FFFFFF"
                style={LoginStyles.icon}
              />
              <TextInput
                placeholder=""
                style={[
                  LoginStyles.input,
                  {
                    borderBottomColor:
                      emailFocused || email.length > 0 ? "#1C2120" : "#1C2120",
                  },
                ]}
                placeholderTextColor="#A0A0A0"
                onChangeText={(text) => setEmail(text)}
                value={email}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
              <View style={LoginStyles.labelContainer}>
                <Text
                  style={[
                    LoginStyles.labelText,
                    {
                      top: emailFocused || email.length > 0 ? -20 : 8,
                      left: 40,
                      color:
                        emailFocused || email.length > 0
                          ? "#A0A0A0"
                          : "#1C2120",
                    },
                  ]}
                >
                  Correo electrónico
                </Text>
              </View>
            </View>
            <View style={LoginStyles.inputWrapper}>
              <Icon
                name="lock"
                size={20}
                color="#A0A0A0"
                style={LoginStyles.icon}
              />
              <TextInput
                placeholder=""
                style={[
                  LoginStyles.input,
                  {
                    borderBottomColor:
                      passwordFocused || password.length > 0
                        ? "#A0A0A0"
                        : "#1C2120",
                  },
                ]}
                secureTextEntry={!showPassword}
                placeholderTextColor="#1C2120"
                onChangeText={(text) => setPassword(text)}
                value={password}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                style={LoginStyles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon
                  name={showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="#1C2120"
                />
              </TouchableOpacity>

              <View style={LoginStyles.labelContainer}>
                <Text
                  style={[
                    LoginStyles.labelText,
                    {
                      top: passwordFocused || password.length > 0 ? -20 : 8,
                      left: 40,
                      color:
                        passwordFocused || password.length > 0
                          ? "#A0A0A0"
                          : "#1C2120",
                    },
                  ]}
                >
                  Contraseña
                </Text>
              </View>
            </View>
          </View>

          {errorMessage !== "" && (
            <Text style={LoginStyles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity
            style={LoginStyles.loginButton}
            onPress={handleLogin}
          >
            <Text style={LoginStyles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={LoginStyles.buttonText}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={LoginStyles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={LoginStyles.buttonText}
            onPress={() => navigation.navigate("CreateAccount")}
          >
            <Text style={LoginStyles.forgotPasswordText}>
              ¿Aun no tienes tu Cuenta?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[LoginStyles.final, { justifyContent: "space-between" }]}>
        <Image
          source={require("../images/panta_derecha.png")}
          style={LoginStyles.logoImagefinal}
        />
        <Image
          source={require("../images/planta_izquierda.png")}
          style={LoginStyles.logoImagefinal}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
