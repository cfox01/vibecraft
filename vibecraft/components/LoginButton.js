// LoginButton.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

const CLIENT_ID = '2277c0609c46422c816b5a42de1f5721'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'http://localhost:8888/callback'; // Expo's redirect URI
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-email`;

const LoginButton = ({ onLogin }) => {
  const [spotifyToken, setSpotifyToken] = useState(null);

  useEffect(() => {
    Linking.addEventListener('url', handleRedirect);
    return () => Linking.removeEventListener('url', handleRedirect);
  }, []);

  const generateRandomState = async () => {
    const randomBytes = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );
    return randomBytes.substring(0, 30); // Extract 30 characters for the state value
  };

  const handleRedirect = async (event) => {
    const { url } = event;
    if (url.startsWith(REDIRECT_URI)) {
      const urlParams = new URL(url);
      const code = urlParams.searchParams.get('code');
      if (code) {
        await fetchAccessToken(code);
      }
    }
  };

  const fetchAccessToken = async (code) => {
    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          // Add client secret if necessary
        }).toString(),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.access_token) {
        setSpotifyToken(tokenData.access_token);
        // Inform the Navigation component about successful login
        onLogin();
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const handleSpotifyLogin = async () => {
    const state = await generateRandomState();
    const authUrl = `${AUTH_URL}&state=${state}`;

    try {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);

      if (result.type === 'success') {
        const urlParams = new URL(result.url);
        const code = urlParams.searchParams.get('code');
        if (code) {
          await fetchAccessToken(code);
        }
      }
    } catch (error) {
      console.error('Error opening auth session:', error);
    }
  };

  return (
    <View style={styles.container}>
      {!spotifyToken ? (
        <Button
          title="Login with Spotify"
          onPress={handleSpotifyLogin}
          color="white"
        />
      ) : (
        <Text>Authenticated with Spotify!</Text>
      )}
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

