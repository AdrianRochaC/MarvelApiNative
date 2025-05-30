import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

import Login from './src/componentes/Login';
import Registro from './src/componentes/Registro';
import Home from './src/componentes/Home';
import Perfil from './src/componentes/Perfil';
import Logout from './src/componentes/Logout';

import AdivinaPersonaje from './src/componentes/AdivinaPersonaje'; // Juego
import MenuMarvel from './src/componentes/MenuMarvel'; // Tu menú

const Tab = createBottomTabNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return unsubscribe;
  }, []);

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Wrapper para añadir menú a cada pantalla
  function withMenu(Component) {
    return function (props) {
      return (
        <View style={{ flex: 1 }}>
          <Component {...props} />
          <MenuMarvel navigation={props.navigation} />
        </View>
      );
    };
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: usuario ? { display: 'none' } : undefined, // oculta tab bar nativo si está logueado
        }}
      >
        {usuario ? (
          <>
            <Tab.Screen name="Home" component={withMenu(Home)} />
            <Tab.Screen name="Original" component={withMenu(AdivinaPersonaje)} />
            <Tab.Screen name="Perfil" component={withMenu(Perfil)} />
            <Tab.Screen name="Logout" component={withMenu(Logout)} />
          </>
        ) : (
          <>
            <Tab.Screen name="Login" component={Login} />
            <Tab.Screen name="Registro" component={Registro} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
