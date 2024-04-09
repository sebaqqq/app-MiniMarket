import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';

import Lista from '../screens/Lista';
import ActualizarLista from '../screens/ActualizarLista';
import Carrito from '../screens/Carrito';
import CrearCategoria from '../screens/CrearCategoria';
import Login from '../screens/Login';
import ForgotPassword from '../screens/RecuperarContrasena'; 

import Loading from './Loading';

import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function Navigation () {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  const Stack = createNativeStackNavigator();
  function MyStack() {
    return (
      <>
        <StatusBar 
          backgroundColor= '#0077B6'
          barStyle = 'light-contenet'
        />
        <Stack.Navigator
          systemUiVisibility={false}
          initialRouteName="Login"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FAFAFA',    
            },
            headerTintColor: '#0077B6',
            backgroundColor: '#9ACEF8',
            headerTitleStyle: {
              fontWeight: 'bold',
           },
          }}
        >
          <Stack.Screen name="Login" component={Login} 
            option= {{
              headerShown: false
            }}
          />
          <Stack.Screen name="Election" component={MyTabs}
          options={{
              headerShown: false
            }}/>
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="Crear Categoria" component={CrearCategoria} />
          <Stack.Screen name="Actualizar Lista" component={ActualizarLista} />
        </Stack.Navigator>
      </>
    )
  }

  const Tab = createBottomTabNavigator();
  function MyTabs() {
    return (
      <Tab.Navigator
        initialRouteName="APP-Minimarket"
        screenOptions={{
          tabBarActiveTintColor: '#0077B6',
          tabBarInactiveTintColor: '#000000',
          tabBarActiveBackgroundColor: '#FFFFFF ',
          tabBarInactiveBackgroundColor: '#FFFFFF',
        }}
      >
        <Tab.Screen 
          name="Lista" 
          component={Lista}
          options={{
            tabBarLabel: 'Lista',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="list-alt" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Carrito" 
          component={Carrito}
          options={{
            tabBarLabel: 'Carrito',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="shoppingcart" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  )
}