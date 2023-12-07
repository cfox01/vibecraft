// LoginButton.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';

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
        <Button
          title="Login with Spotify"
          onPress={handleLoginPress}
          color="white"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 25,
    width: '40%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default LoginButton;

