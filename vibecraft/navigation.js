// Navigation.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Loginpage from './components/loginpage';
import Homepage from './components/homepage';
import PlaylistPage from './components/PlaylistPage';


const Stack = createStackNavigator();

const AuthStack = ({ onLogin }) => (
  <Stack.Navigator>
    <Stack.Screen name="Login" options={{headerShown: false}}>
      {() => <Loginpage onLogin={onLogin} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Homepage} options={{headerShown: false}}/>
    <Stack.Screen name="Playlist" component={PlaylistPage} options={{title: 'Playlist Generator', headerShadowVisible: false, headerStyle: {
            backgroundColor: '#242424',
          }, headerTitleStyle: {
            color: '#fff',
          },
            }}/>
  </Stack.Navigator>
);

const Navigation = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const handleLogin = () => {
    setUserLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {!userLoggedIn ? (
        <AuthStack onLogin={handleLogin} />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default Navigation;

