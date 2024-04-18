import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Button } from 'react-native';
import { db } from "../DB/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; 
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Historial = () => {
  const navigation = useNavigation();
  const [historialCompleto, setHistorialCompleto] = useState([]);
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPorFecha, setTotalPorFecha] = useState({});
  const [totalPorMes, setTotalPorMes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const historialCollection = collection(db, 'historialVentas');
        const historialSnapshot = await getDocs(historialCollection);
        const historialData = historialSnapshot.docs.map(doc => {
          const data = doc.data();
          const totalCompra = parseFloat(data.totalCompra);
          return {
            id: doc.id,
            ...data,
            totalCompra: isNaN(totalCompra) ? 0 : totalCompra 
          };
        });
        setHistorialCompleto(historialData);
        setLoading(false);
        calcularTotalPorFecha(historialData);
        calcularTotalPorMes(historialData);
      } catch (error) {
        console.error("Error fetching historial:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchHistorial();

    const reiniciarTotales = setInterval(() => {
      setTotalPorFecha({});
    }, 24 * 60 * 60 * 1000); 

    return () => clearInterval(reiniciarTotales);
  }, []);

  useEffect(() => {
    filtrarHistorialPorFecha(selectedDate);
  }, [selectedDate]);

  const calcularTotalPorFecha = (historialData) => {
    const totalPorFecha = {};
    historialData.forEach(item => {
      const fecha = formatFecha(item.fecha);
      if (fecha === formatFecha(selectedDate)) { // Utiliza la fecha seleccionada
        const totalCompra = parseFloat(item.totalCompra);
        totalPorFecha[fecha] = (totalPorFecha[fecha] || 0) + totalCompra;
      }
    });
    setTotalPorFecha(totalPorFecha);
    // Actualizar total por mes
    calcularTotalPorMes(historialData);
  };

  const calcularTotalPorMes = (historialData) => {
    const totalPorMes = {};
    historialData.forEach(item => {
      const fecha = new Date(item.fecha);
      const yearMonth = fecha.getFullYear() + '-' + (fecha.getMonth() + 1);
      if (!totalPorMes[yearMonth]) {
        totalPorMes[yearMonth] = 0;
      }
      totalPorMes[yearMonth] += parseFloat(item.totalCompra);
    });
    setTotalPorMes(totalPorMes);
  };

  const filtrarHistorialPorFecha = (fecha) => {
    const fechaSeleccionada = formatFecha(fecha);
    const filteredHistorial = historialCompleto.filter(item => {
      const fechaItem = formatFecha(item.fecha);
      return fechaItem === fechaSeleccionada;
    });
    setHistorialFiltrado(filteredHistorial);
    calcularTotalPorFecha(filteredHistorial);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      navigation.navigate('DetallesCarrito', { carritoId: item.id });
    }}>
      <View style={styles.itemContainer}>
        <Text>ID: {item.id}</Text>
        <Text>Fecha: {formatFecha(item.fecha)}</Text>
        <Text>Total Compra: {item.totalCompra}</Text>
      </View>
    </TouchableOpacity>
  );

  const formatFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const historialCollection = collection(db, 'historialVentas');
      const historialSnapshot = await getDocs(historialCollection);
      const historialData = historialSnapshot.docs.map(doc => {
        const data = doc.data();
        const totalCompra = parseFloat(data.totalCompra);
        return {
          id: doc.id,
          ...data,
          totalCompra: isNaN(totalCompra) ? 0 : totalCompra 
        };
      });
      setHistorialCompleto(historialData);
      setLoading(false);
      calcularTotalPorFecha(historialData);
      calcularTotalPorMes(historialData);
    } catch (error) {
      console.error("Error fetching historial:", error);
      setError(error);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  const handleDateSelected = (date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
      <FlatList
        data={historialFiltrado}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={ 
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total por Día:</Text>
        {Object.keys(totalPorFecha).map(fecha => (
          <Text key={fecha}>{fecha}: {totalPorFecha[fecha]}</Text>
        ))}
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total por Mes:</Text>
        {Object.keys(totalPorMes).map(yearMonth => (
          <Text key={yearMonth}>{yearMonth}: {totalPorMes[yearMonth]}</Text>
        ))}
      </View>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={selectedDate}
        onConfirm={handleDateSelected}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width:350,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  totalContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 15,
  }
});

export default Historial;
