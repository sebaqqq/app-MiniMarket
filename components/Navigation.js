import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';

import Lista from '../screens/Lista';
import ActualizarLista from '../screens/ActualizarLista';
import CrearCategoria from '../screens/CrearCategoria';
import Login from '../screens/Login';
import ForgotPassword from '../screens/RecuperarContrasena'; 
import EscanerCodigoBarras from '../screens/CodigoBarras';
import CrearLista from '../screens/CrearLista';
import Historial from '../screens/Historial';
import CarritoCompra from '../screens/Carrito';
import CreateAccount from '../screens/CrearCuenta';
import Perfil from '../screens/Cuenta';
import EditarUser from '../screens/EditarUser';

import Loading from './Loading';

import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

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
          <Stack.Screen name="ActualizarLista" component={ActualizarLista} />
          <Stack.Screen name="CarritoCompra" component={CarritoCompra} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="Editar Usuario" component={EditarUser} />
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
          name="Añadir Producto" 
          component={CrearLista}
          options={{
            tabBarLabel: 'Añadir Producto',
            tabBarIcon: ({ color, size }) => (
              <Entypo name="add-to-list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Codigo de Barras" 
          component={EscanerCodigoBarras}
          options={{
            tabBarLabel: 'Codigo de Barras',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="barcode" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Historial" 
          component={Historial}
          options={{
            tabBarLabel: 'Historial',
            tabBarIcon: ({ color, size }) => (
              <Fontisto name="history" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Perfil" 
          component={Perfil}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" size={size} color={color} />
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