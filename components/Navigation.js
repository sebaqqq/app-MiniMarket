import 'react-native-gesture-handler';
import React from 'react';
import { View, Animated, TouchableWithoutFeedback, Vibration } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';

import Lista from '../screens/Lista';
import ActualizarLista from '../screens/ActualizarLista';
import CrearCategoria from '../screens/CrearCategoria';
import Login from '../screens/Login';
import ForgotPassword from '../screens/RecuperarContrasena';
import EscanerCodigoBarras from '../screens/CodigoBarras';
import CrearLista from '../screens/CrearLista';
import Historial from '../screens/Historial';
import CreateAccount from '../screens/CrearCuenta';
import Perfil from '../screens/Cuenta';
import EditarUser from '../screens/EditarUser';
import DetallesCarrito from '../screens/DetallesCarrito';

import Loading from './Loading';

import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function Navigation() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const Stack = createNativeStackNavigator();
  function MyStack() {
    return (
      <>
        <StatusBar
          backgroundColor='#0077B6'
          barStyle='light-content'
        />
        <Stack.Navigator
          systemUiVisibility={false}
          initialRouteName='Login'
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
          <Stack.Screen name='Login' component={Login}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen name='Election' component={MyTabs}
            options={{
              headerShown: false
            }} />
          <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
          <Stack.Screen name='Crear Categoria' component={CrearCategoria} />
          <Stack.Screen name='ActualizarLista' component={ActualizarLista} />
          <Stack.Screen name='CreateAccount' component={CreateAccount} />
          <Stack.Screen name='Editar Usuario' component={EditarUser} />
          <Stack.Screen name='DetallesCarrito' component={DetallesCarrito} />
        </Stack.Navigator>
      </>
    );
  }

  const Tab = createBottomTabNavigator();
  function MyTabs() {
    return (
      <Tab.Navigator
        initialRouteName='Lista'
        tabBar={(props) => <MyTabBar {...props} />}
      >
        <Tab.Screen
          name='Lista'
          component={Lista}
          options={{
            tabBarLabel: 'Lista',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name='list-alt' size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='CrearLista'
          component={CrearLista}
          options={{
            tabBarLabel: 'Añadir',
            tabBarIcon: ({ color, size }) => (
              <Entypo name='add-to-list' size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='EscanerCodigoBarras'
          component={EscanerCodigoBarras}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size }) => (
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 5,
                backgroundColor: '#0077B6',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <AntDesign name='barcode' size={size} color={'#FFFFFF'} />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name='Historial'
          component={Historial}
          options={{
            tabBarLabel: 'Historial',
            tabBarIcon: ({ color, size }) => (
              <Fontisto name='history' size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='Perfil'
          component={Perfil}
          options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <Feather name='user' size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

function MyTabBar({ state, descriptors, navigation }) {
  const [translateValue] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    const listener = state.index ? translateValue.setValue(state.index * 100) : null;
    return () => {
      if (listener) listener.remove();
    };
  }, [state.index, translateValue]);

  const onTabPress = (route, isFocused) => {
    Vibration.vibrate(50); 

    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onTabLongPress = (route) => {
    Vibration.vibrate(50); 

    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  return (
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#999', backgroundColor: '#f5f5f5', height: 50 }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        return (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => onTabPress(route, isFocused)}
            onLongPress={() => onTabLongPress(route)}
            accessibilityRole='button'
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {options.tabBarIcon({ color: isFocused ? '#0077B6' : '#000', size: 24 })}
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}
