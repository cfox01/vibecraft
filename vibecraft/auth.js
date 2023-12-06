import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import queryString from 'query-string';

const CLIENT_ID = process.env.EXPO_PUBLIC_ID; // Replace with your Spotify Client ID
const REDIRECT_URI = process.env.EXPO_PUBLIC_URI;// Expo's redirect URI
const CLIENT_SECRET = process.env.EXPO_PUBLIC_SECRET; // Spotufy client secret

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-email,user-library-read,playlist-modify-public,playlist-modify-private,user-follow-read`;

let accessToken = null;
let userDisplayName = null;
let refreshToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const setRefreshToken = (rtoken) => {
  refreshToken = rtoken;
};

export const getRefreshToken = () => {
  return refreshToken;
};

export const setUserDisplayName = (name) => {
  userDisplayName = name;
};

export const getUserDisplayName = () => {
  return userDisplayName;
};

export const generateRandomState = async () => {
    const randomBytes = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      Math.random().toString()
    );
    return randomBytes.substring(0, 30); // Extract 30 characters for the state value
  };


export const fetchAccessToken = async (code) => {
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
        setUserDisplayName(await fetchUserInfo(tokenData.access_token));
        setAccessToken(tokenData.access_token);
        setRefreshToken(tokenData.refresh_token);
        return true;

      } else {
        console.error('Access token not found in the response:', tokenData);
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

export const RefreshAccessToken = async () => {

     // refresh token that has been previously stored
     const reToken = localStorage.getItem('refresh_token');
     const url = "https://accounts.spotify.com/api/token";
  
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: reToken,
          client_id: CLIENT_ID
        }),
      }
      const body = await fetch(url, payload);
      const response = await body.json();

      setRefreshToken(response.refresh_token);
      setAccessToken(response.access_token);
}

export const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        const userDisplayName = userData.display_name;
        return userDisplayName;

      } else {
        console.error('Error fetching user information:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user information:', error);
    }
  };

 export const handleSpotifyLogin = async () => {
    const state = await generateRandomState();
    const authUrl = `${AUTH_URL}&state=${state}`;
  
    try {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
  
      if (result.type === 'success') {
        // Use queryString to parse the URL parameters
        const urlParams = queryString.parseUrl(result.url);
        const { code } = urlParams.query;
  
        if (code) {
          const aT = await fetchAccessToken(code);
          return aT;

        }
      }
    } catch (error) {
      console.error('Error opening auth session:', error);
    }
  };