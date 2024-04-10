import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';

const CarritoCompra = ({ carrito, removeFromCart }) => {
    return (
        <View>
            <Text>Productos en el carrito:</Text>
            <FlatList
                data={carrito}
                keyExtractor={(item, index) => index.toString()} // Usar el índice como clave si no hay una propiedad id válida
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                        <Text>{item.nombreProducto}</Text>
                        <Text>${item.precio}</Text>
                        <Button title="Eliminar" onPress={() => removeFromCart(item.id)} />
                    </View>
                )}
            />
        </View>
    );
};

export default CarritoCompra;
