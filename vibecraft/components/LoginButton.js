// LoginButton.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import { handleSpotifyLogin } from '../auth';

const LoginButton = ({onLogin}) => {
  const [loggedIn, setLoggedIn] = useState(false);
 

  useEffect(() => {
    if (loggedIn) {
      onLogin()
    }
  }, [loggedIn]);

  const handleLoginPress = async () => {
    setLoggedIn(await handleSpotifyLogin())
  }
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleLoginPress}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Login with Spotify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    width: 180,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1DB954',
  },
  button: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold', 
    color: '#191414',
    fontSize: 18, 
  },
});

export default LoginButton;




