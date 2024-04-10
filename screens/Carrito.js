import React from 'react';
import { View, Text, FlatList, Button } from 'react-native';

const CarritoCompra = ({ carrito, removeFromCart }) => {
    return (
        <View>
            <Text>Productos en el carrito:</Text>
            <FlatList
                data={carrito}
                keyExtractor={(item) => item.id.toString()} // Asumiendo que el id del producto es un número
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
