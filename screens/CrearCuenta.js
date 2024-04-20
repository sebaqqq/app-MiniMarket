import React, { useState } from "react";
import { Text, View, Button, StyleSheet, Alert, TextInput } from 'react-native';
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <Button style={styles.button} title="Crear Cuenta" onPress={handleCreateAccount} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: '#007bff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateAccount;
