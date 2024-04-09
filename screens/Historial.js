// Historial.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/storage';
import { db } from "../DB/firebase";

const Historial = ({ navigation }) => {
    const [ventas, setVentas] = useState([]);

    useEffect(() => {
    const fetchVentas = async () => {
        try {
        const ventasSnapshot = await getDocs(collection(db, 'ventas'));
        const ventasData = ventasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVentas(ventasData);
        } catch (error) {
        console.error('Error al obtener el historial de ventas:', error);
        }
    };

    fetchVentas();
    }, []);

    const handleVerDetalles = (productos) => {
    navigation.navigate('DetallesProductos', { productos });
    };

    const sumarTotalesDelDia = (ventasDelDia) => {
        return ventasDelDia.reduce((total, venta) => total + venta.total, 0);
      };
      
      const ventasDelDia = ventas.filter((venta) => {
        // Lógica para comparar las fechas, por ejemplo, si es del mismo día
        // Puedes ajustar esta lógica según cómo estén estructuradas tus fechas
        // Aquí se asume que las fechas son objetos tipo Date
        return (
          venta.fechaHora &&
          venta.fechaHora.toDate().toLocaleDateString() === new Date().toLocaleDateString()
        );
      });
      
    const totalDelDia = sumarTotalesDelDia(ventasDelDia);

    const renderizarItemVenta = ({ item }) => {
        console.log('Item:', item); // Agregar este registro
        return (
            <TouchableOpacity onPress={() => handleVerDetalles(item.productos)}>
                <View style={styles.itemVenta}>
                    <Text>{`Fecha y Hora: ${item.fechaHora ? item.fechaHora.toDate().toLocaleString() : 'N/A'}`}</Text>
                    {typeof item.total === 'number' && !isNaN(item.total) && (
                        <Text>{`Total: $${item.total.toFixed(2)}`}</Text>
                    )}
                    {/* Otros detalles de la venta que desees mostrar */}
                    <Text>{`Total: $${item.total}`}</Text>
                    
                </View>
            </TouchableOpacity>
        );
    };

    return (
    <View style={styles.container}>
        <Text style={styles.titulo}>Historial de Ventas</Text>
        <FlatList
        data={ventas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarItemVenta}
        />
        
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    padding: 16,
    },
    titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    },
    itemVenta: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    },
});

export default Historial;