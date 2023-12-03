// LoginButton.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import queryString from 'query-string';

const CLIENT_ID = process.env.EXPO_PUBLIC_ID; // Replace with your Spotify Client ID
const REDIRECT_URI = process.env.EXPO_PUBLIC_URI;// Expo's redirect URI
const CLIENT_SECRET = process.env.EXPO_PUBLIC_SECRET; // Spotufy client secret

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-email`;

const LoginButton = ({ onLogin }) => {
  const [loggedIn, setLoggedIn] = useState(false);


  useEffect(() => {
    if(loggedIn) onLogin();

  }, [loggedIn]);

  const generateRandomState = async () => {
    const randomBytes = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );
    return randomBytes.substring(0, 30); // Extract 30 characters for the state value
  };


  const fetchAccessToken = async (code) => {
    try {

      // Construct the body parameters using query-string
      const bodyParams = queryString.stringify({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        // Add client secret if necessary
        client_secret: CLIENT_SECRET,
      });

      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams,
      });

      // Handle the response and parse JSON
      const tokenData = await tokenResponse.json();

      // Check if access_token exists in the response
      if (tokenData.access_token) {
        setLoggedIn(true);
      } else {
        console.error('Access token not found in the response:', tokenData);
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
        // Use queryString to parse the URL parameters
        const urlParams = queryString.parseUrl(result.url);
        const { code } = urlParams.query;
  
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
        <Button
          title="Login with Spotify"
          onPress={handleSpotifyLogin}
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

