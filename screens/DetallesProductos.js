import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetallesProductos = ({ route }) => {
const { productos } = route.params;

// Calcular el total
const total = productos.reduce((acc, producto) => {
    return acc + producto.cantidad * producto.precio;
}, 0);

// Formatear el total a miles y sin decimales
const formattedTotal = total.toLocaleString('en-US', { maximumFractionDigits: 0 });

return (
    <View style={styles.container}>
    <Text style={styles.titulo}>Detalles de Productos</Text>
    <View>
        {productos.map((producto, index) => (
        <View key={index} style={styles.productoContainer}>
            <Text>{`Producto: ${producto.nombreProducto}`}</Text>
            <Text>{`Cantidad: ${producto.cantidad}`}</Text>
            <Text>{`Precio: $${Math.floor(producto.precio)}`}</Text>
            {/* Agrega más detalles según tus necesidades */}
        </View>
        ))}
    </View>
    <Text style={styles.totalText}>{`Total: $${formattedTotal}`}</Text>
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
productoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
},
totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
},
});

export default DetallesProductos;
