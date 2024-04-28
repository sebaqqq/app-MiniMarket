import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { db } from "../DB/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';

const Historial = () => {
  const navigation = useNavigation();
  const [historialCompleto, setHistorialCompleto] = useState([]);
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  const [totalPorFecha, setTotalPorFecha] = useState({});
  const [totalPorMes, setTotalPorMes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // Nuevo estado para controlar la visibilidad del selector de fecha
  const [selectedDate, setSelectedDate] = useState(new Date()); // Nuevo estado para almacenar la fecha seleccionada

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const historialCollection = collection(db, "historialVentas");
        const historialSnapshot = await getDocs(historialCollection);
        const historialData = historialSnapshot.docs.map((doc) => {
          const data = doc.data();
          const totalCompra = parseFloat(data.totalCompra);
          return {
            id: doc.id,
            ...data,
            totalCompra: isNaN(totalCompra) ? 0 : totalCompra,
          };
        });
        setHistorialCompleto(historialData);
        calcularTotalPorFecha(historialData);
        calcularTotalPorMes(historialData);
      } catch (error) {
        console.error("Error fetching historial:", error);
      }
    };
    fetchHistorial();
  }, []);

  useEffect(() => {
    filtrarHistorialPorFecha(selectedDate);
  }, [selectedDate]);

  const calcularTotalPorFecha = (historialData) => {
    const totalPorFecha = {};
    historialData.forEach((item) => {
      const fecha = formatFecha(item.fecha);
      if (fecha === formatFecha(selectedDate)) {
        const totalCompra = parseFloat(item.totalCompra);
        totalPorFecha[fecha] = (totalPorFecha[fecha] || 0) + totalCompra;
      }
    });
    setTotalPorFecha(totalPorFecha);
  };

  const calcularTotalPorMes = (historialData) => {
    const totalPorMes = {};
    historialData.forEach((item) => {
      const fecha = new Date(item.fecha);
      const yearMonth = fecha.getFullYear() + "-" + (fecha.getMonth() + 1);
      if (!totalPorMes[yearMonth]) {
        totalPorMes[yearMonth] = 0;
      }
      totalPorMes[yearMonth] += parseFloat(item.totalCompra);
    });
    setTotalPorMes(totalPorMes);
  };

  const filtrarHistorialPorFecha = (fecha) => {
    const fechaSeleccionada = formatFecha(fecha);
    const filteredHistorial = historialCompleto.filter((item) => {
      const fechaItem = formatFecha(item.fecha);
      return fechaItem === fechaSeleccionada;
    });
    setHistorialFiltrado(filteredHistorial);
    calcularTotalPorFecha(filteredHistorial);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("DetallesCarrito", { carritoId: item.id });
      }}
    >
      <View style={styles.itemContainer}>
        <Text>Vendedor: {item.usuario?.firstName}</Text>
        <Text>Fecha Compra: {formatFecha(item.fecha)}</Text>
        <Text>Total Compra: {item.totalCompra}</Text>
      </View>
    </TouchableOpacity>
  );

  const formatFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleDateSelected = (event, selectedDate) => {
    setShowDatePicker(false); // Oculta el selector de fecha
    if (selectedDate) {
      setSelectedDate(selectedDate); // Actualiza la fecha seleccionada
    }
  };
  
  const showDatePickerModal = () => {
    setShowDatePicker(true); // Muestra el selector de fecha
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={showDatePickerModal}
        style={styles.boton}
      >
        <Text style={styles.botonText}>Seleccionar Fecha</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateSelected}
        />
      )}
      
      <FlatList
        data={historialFiltrado}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>Vendedor: {item.usuario?.firstName}</Text>
            <Text>Fecha Compra: {formatFecha(item.fecha)}</Text>
            <Text>Total Compra: {item.totalCompra}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total por Día:</Text>
        {Object.keys(totalPorFecha).map((fecha) => (
          <Text key={fecha}>
            {fecha}: {totalPorFecha[fecha]}
          </Text>
        ))}
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total por Mes:</Text>
        {Object.keys(totalPorMes).map((yearMonth) => (
          <Text key={yearMonth}>
            {yearMonth}: {totalPorMes[yearMonth]}
          </Text>
        ))}
      </View>

    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    width: 350,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  boton: {
    backgroundColor: "#1C2120",
    padding: 10,
    borderRadius: 8,
    width: "70%",
    alignItems: "center",
  },
  botonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default Historial;
