import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, Image, ScrollView,TouchableOpacity} from 'react-native'; // Add ScrollView
import { SearchBar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getAccessToken } from '../auth';

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
  dropdownContainer: {
    position: 'absolute',
    top: 85, // Adjust the top position as needed
    left: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#3A3F40',
    borderRadius: 0,
    elevation: 3, // Add elevation for shadow on Android
  },
  dropdownItem: {
    padding: 10,
  },

  dropdownText: {
    color: 'white',
  },

  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 5,
  },
});

const PlaylistPage = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigation = useNavigation();

  const handleSearch = async (text) => {
    try {
      setSearchText(text);

      const accessToken = await getAccessToken();

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
      // console.log(data);
      setSearchResults(data.artists.items || []);
      setShowDropdown(text.length > 0); // Show the dropdown when results are available
    } catch (error) {
      console.error('Error fetching artist data:', error);
      Alert.alert('Error', 'Failed to fetch artist data. Please try again.');
    }
  };

  const handleKeyPress = () => {
    // console.log("Pressed Enter", searchText);
    handleSearch(searchText);
  };

  const handleSelectArtist = (artist) => {
    // console.log('Selected artist:', artist);

    setShowDropdown(false);

    // console.log('Try:', artist.id);

    navigation.navigate('GeneratePlaylist', { selectedArtistId: artist.id });
  };

  useEffect(() => {

    if (searchText === '') {
      setShowDropdown(false);
    }
  }, [searchText]);

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

    

    {showDropdown && (
        <ScrollView style={styles.dropdownContainer}>
          {searchResults.map((artist, index) => (
            <React.Fragment key={artist.id}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectArtist(artist)}
              >
                <Text style={styles.dropdownText}>{artist.name}</Text>
              </TouchableOpacity>
              {index < searchResults.length - 1 && <View style={styles.separator} />}
            </React.Fragment>
          ))}
        </ScrollView>
      )}


    </LinearGradient>
  );
};

export default PlaylistPage;



