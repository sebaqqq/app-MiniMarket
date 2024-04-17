import React, { useState, useEffect } from "react";
import { Text, View, Button, TextInput, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from "../DB/firebase";
import { collection, getDocs,setDoc, doc, getDoc } from "firebase/firestore";
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

const CrearLista = () => {
    const navigation = useNavigation();
    const [state, setState] = useState({
        idProducto:'',
        nombreProducto: '',
        categoria: '',
        precio: '',
        precioOferta: ''
    });
    const [message, setMessage] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [productosEscaneados, setProductosEscaneados] = useState([]);
    const [mostrarAlerta, setMostrarAlerta] = useState(true);

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

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const GuardarProducto = async () => {
        try {
            if (!state.idProducto || !state.nombreProducto || !state.categoria || !state.precio) {
                Alert.alert('Campos obligatorios', 'Por favor, complete todos los campos obligatorios.');
                return;
            }

            const producto = {
                idProducto: state.idProducto, 
                nombreProducto: state.nombreProducto,
                categoria: state.categoria,
                precio: parseFloat(state.precio),
                precioOferta: state.precioOferta ? parseFloat(state.precioOferta) : null,
            };

            await setDoc(doc(db, 'productos', state.idProducto), producto);
            setMessage('Producto guardado exitosamente');

            setState({
                idProducto: '', 
                nombreProducto: '',
                categoria: '',
                precio: '',
                precioOferta: ''
            });

        } catch (error) {
            console.error('Error al guardar el producto:', error);
            Alert.alert('Error', 'Hubo un error al intentar guardar el producto');
        }
    };

    const obtenerCategorias = async () => {
        try {
            setRefreshing(true);
            const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
            const categoriasData = categoriasSnapshot.docs.map(doc => doc.data().nombreCategoria);
            setCategorias(categoriasData);
            setRefreshing(false);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            Alert.alert('Error', 'Hubo un error al obtener las categorías.');
            setRefreshing(false);
        }
    };

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../sound/beep.mp3')
            );
            await sound.playAsync();
        } catch (error) {
            console.error('Error al reproducir el sonido:', error);
        }
    };

    const handleChangeText = (key, value) => {
        setState(prevState => ({ ...prevState, [key]: value }));
        setMessage(null);
    };

    const handleCodigoBarrasScanned = (codigoBarras) => {
        setState(prevState => ({ ...prevState, idProducto: codigoBarras }));
        playSound()
    };

    const startScanning = () => {
        setScanning(true);
    };

    const handleBarCodeScanned = async ({ data }) => {
        try {
            if (productosEscaneados.includes(data)) {
                return;
            }
    
            const productoRef = doc(db, 'productos', data);
            const productoSnapshot = await getDoc(productoRef);
    
            if (productoSnapshot.exists()) {
                const producto = productoSnapshot.data();
                if (mostrarAlerta) {
                    Alert.alert('Producto encontrado', `El producto '${producto.nombreProducto}' ya existe en la base de datos.`);
                    setMostrarAlerta(false);
                }
            } else {
                handleCodigoBarrasScanned(data);
                playSound();
                setProductosEscaneados([...productosEscaneados, data]);
                setMostrarAlerta(true);
            }
        } catch (error) {
            console.error('Error al buscar el producto:', error);
            Alert.alert('Error', 'Hubo un error al buscar el producto en la base de datos.');
        }
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
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={obtenerCategorias}
                />
            }
        >
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
                <ScrollView>
                    <Picker
                        selectedValue={state.categoria}
                        style={styles.input}
                        onValueChange={(value) => handleChangeText('categoria', value)}>
                        <Picker.Item label="Seleccione una categoría" value="" />
                        {categorias.map((categoria, index) => (
                            <Picker.Item key={index} label={categoria} value={categoria} />
                        ))}
                    </Picker>
                </ScrollView>
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
        backgroundColor: '#f0f0f0',
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        marginTop: 16,
        backgroundColor: '#0077B6',
        borderRadius: 4,
    },
    button: {
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 10,
    },
    cameraContainer: {
        aspectRatio: 4 / 3,
        overflow: 'hidden',
        borderRadius: 10,
        marginBottom: 16,
    },
    camera: {
        flex: 1,
    },
    message: {
        color: 'green',
        textAlign: 'center',
        marginTop: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default CrearLista;
