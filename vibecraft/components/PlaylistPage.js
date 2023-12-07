import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, Image } from 'react-native'; // Add necessary imports
import { SearchBar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { getAccessToken } from '../auth'; // Make sure this function fetches the access token properly

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  resultsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  artistCard: {
    alignItems: 'center',
    margin: 10,
  },
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  artistName: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // ... add more styles as needed
});

const PlaylistPage = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (text) => {
    try {
      setSearchText(text); // Update search text

      const accessToken = await getAccessToken(); // Fetch the access token

      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(text)}&type=artist&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      console.log(data);
      setSearchResults(data.artists.items || []); // Update search results or set to empty array if no items
    } catch (error) {
      console.error('Error fetching artist data:', error);
      Alert.alert('Error', 'Failed to fetch artist data. Please try again.');
    }
  };

  const handleKeyPress = () => {
      console.log("Pressed Enter", searchText);
      handleSearch(searchText);
  };

  return (
    <LinearGradient
      colors={[
        'rgba(212,173,249,1)',
        'rgba(113,0,218,1)',
        'rgba(0,0,0,1)',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SearchBar
        placeholder="Enter Artist Name..."
        onChangeText={setSearchText}
        value={searchText}
        onSubmitEditing={handleKeyPress}
      />
  
      {/* Display the search results */}
      <View style={styles.resultsContainer}>
        {searchResults.map((artist) => (
          <View key={artist.id} style={styles.artistCard}>
            <Text style={styles.artistName}>{artist.name}</Text>
            {/* Add more artist information as needed */}
          </View>
        ))}
      </View>
    </LinearGradient>
  );
};


export default PlaylistPage;


