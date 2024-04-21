import React, { useState } from "react";
import { Text, View, Button, StyleSheet, Alert, TextInput, TouchableOpacity, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from "../DB/firebase";


const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const handleCreateAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
      });

      Alert.alert('Success', 'Account created successfully');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };



  const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta </Text>
      <Text style={styles.title}>nueva</Text>


      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su Apellido"
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput
        style={styles.input}
        placeholder="opcional"
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="@gmail"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="minimo 6 caracteres"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <CustomButton title="Crear Cuenta" onPress={handleCreateAccount} />




      <View style={[styles.final]}>
        <Image
          source={require("../images/panta_derecha.png")}
          style={styles.logoImagefinal}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#D4D4D4',
  },

  label: {
    width: '80%',
    paddingBottom:5,
    paddingTop:5
  },


  crearCuenta: {
    width: '80%', 
    height: 40,
    backgroundColor: '#1C2120',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, 
  },
  
  button: {
    width: '80%',
    height: 40,
    backgroundColor: '#1C2120',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  final: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%",
  },
  logoImagefinal: {
    width: 150,
    height: 150,
    marginLeft: "-22%",
    marginRight: "-20%",
    marginTop: "-18%",
    marginBottom: "-18%", // Ajusta este valor según sea necesario
  },
});

export default CreateAccount;
