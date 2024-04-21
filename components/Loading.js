import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LoadingStyles } from "../styles/LoadingEstilo";

const Loading = () => {
  return (
    <View style={LoadingStyles.loadingContainer}>
      <ActivityIndicator size="large" color="#1C2120" />
      <Text style={LoadingStyles.loadingText}>Cargando...</Text>
    </View>
  );
};

export default Loading;
