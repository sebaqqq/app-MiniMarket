import React, { useState, useEffect } from "react";
import { Text, View, Button, TextInput, ScrollView, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';
import { db, storage } from "../DB/firebase";
import { collection, getDocs,setDoc, doc } from "firebase/firestore";
import { Camera } from 'expo-camera';

const CrearLista = () => {
    const navigation = useNavigation();
    const [state, setState] = useState({
        idProducto:'',
        nombreProducto: '',
        categoria: '',
        precio: '',
        precioOferta: '',
        imagen: null,
    });
    const [message, setMessage] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [scanning, setScanning] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({ 
            headerRight: () => (
                <MaterialIcons
                    name="category"
                    size={26}
                    right={20}
                    color="#0077B6"
                    onPress={() => navigation.navigate('Crear Categoria')}
                />
            ),
        });
    }, [navigation]);

    const GuardarProducto = async () => {
        try {
            if (!state.idProducto || !state.nombreProducto || !state.categoria || !state.precio) {
                Alert.alert('Campos obligatorios', 'Por favor, complete todos los campos obligatorios.');
                return;
            }

            const imageUrl = await uploadImage();
            const precio = parseFloat(state.precio);
            const precioOferta = state.precioOferta ? parseFloat(state.precioOferta) : null;
            const producto = {
                idProducto: state.idProducto, 
                nombreProducto: state.nombreProducto,
                categoria: state.categoria,
                precio: precio,
                precioOferta: precioOferta,
                imagen: imageUrl,
            };

            await setDoc(doc(db, 'productos', state.idProducto), producto);
            setMessage('Producto guardado exitosamente');

            setState({
                idProducto: '', 
                nombreProducto: '',
                categoria: '',
                precio: '',
                precioOferta: '',
                imagen: null,
            });

        } catch (error) {
            console.error('Error al guardar el producto:', error);
            Alert.alert('Error', 'Hubo un error al intentar guardar el producto');
        }
    };

    useEffect(() => {
        const requestMediaLibraryPermissions = async () => {
            try {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permisos requeridos', 'Se requieren permisos para acceder a la galería.');
                }
            } catch (error) {
                console.error('Error al solicitar permisos:', error);
            }
        };

        requestMediaLibraryPermissions();

        obtenerCategorias();
    }, []);

    const obtenerCategorias = async () => {
        try {
            const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
            const categoriasData = categoriasSnapshot.docs.map(doc => doc.data().nombreCategoria);
            setCategorias(categoriasData);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            Alert.alert('Error', 'Hubo un error al obtener las categorías.');
        }
    };

    const handleChangeText = (key, value) => {
        setState(prevState => ({ ...prevState, [key]: value }));
        setMessage(null);
    };

    const handleCodigoBarrasScanned = (codigoBarras) => {
        setState(prevState => ({ ...prevState, idProducto: codigoBarras }));
    };

    const startScanning = () => {
        setScanning(true);
    };

    const handleBarCodeScanned = ({ data }) => {
        handleCodigoBarrasScanned(data);
    };

    if (scanning) {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text>ID</Text>
                    <Text>ID: {state.idProducto}</Text>
                </View>
                <View style={styles.inputContainer}>
                    <Button title="Detener escaneo" onPress={() => setScanning(false)} />
                </View>
                <View style={styles.cameraContainer}>
                    <Camera
                        style={styles.camera}
                        type={Camera.Constants.Type.back}
                        onBarCodeScanned={handleBarCodeScanned}
                    />
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text>ID</Text>
                <Text>ID: {state.idProducto}</Text>
            </View>
            <View style={styles.inputContainer}>
                <Button title="Escanear código de barras" onPress={startScanning} />
            </View>
            <View style={styles.inputContainer}>
                <Text>Ingrese el nombre del producto</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre del producto"
                    value={state.nombreProducto}
                    onChangeText={(value) => handleChangeText('nombreProducto', value)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Seleccione la categoría</Text>
                <Picker
                    selectedValue={state.categoria}
                    style={styles.input}
                    onValueChange={(value) => handleChangeText('categoria', value)}>
                    <Picker.Item label="Seleccione una categoría" value="" />
                    {categorias.map((categoria, index) => (
                        <Picker.Item key={index} label={categoria} value={categoria} />
                    ))}
                </Picker>
            </View>
            <View style={styles.inputContainer}>
                <Text>Ingrese el precio</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Precio/u"
                    keyboardType="numeric"
                    value={state.precio}
                    onChangeText={(value) => handleChangeText('precio', value)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Ingrese una oferta (opcional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Precio en oferta"
                    keyboardType="numeric"
                    value={state.precioOferta}
                    onChangeText={(value) => handleChangeText('precioOferta', value)}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Guardar producto" onPress={GuardarProducto} />
            </View>
            {message && <Text style={styles.message}>{message}</Text>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    input: {
      height: 30,
      borderBottomWidth: 1,
      borderColor: 'gray',
      paddingLeft: 8,
      textAlignVertical: 'bottom',
    },
    buttonContainer: {
      marginTop: 16,
    },
    cameraContainer: {
      aspectRatio: 4/3, 
      overflow: 'hidden',
      borderRadius: 10, 
    },
    camera: {
      flex: 1,
    },
    message: {
      color: 'green',
      textAlign: 'center',
      marginTop: 16,
    },
  });
  
export default CrearLista;
