// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { getAccessToken } from '../auth';
import { useRoute } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  albumCard: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
  },
  albumName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Add more styles as needed
});

const PlaylistGenerator = () => {

    const route = useRoute();
    const { selectedArtistId } = route.params;

    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    // console.log('Catch:', selectedArtistId);
  
    useEffect(() => {
      // Fetch the artist's albums when the component mounts or when selectedArtistId changes
      fetchArtistAlbums();
    }, [selectedArtistId]); // Add selectedArtistId as a dependency to trigger useEffect on changes
  
    const fetchArtistAlbums = async () => {
      try {
        const accessToken = await getAccessToken();
  
        const response = await fetch(`https://api.spotify.com/v1/artists/${selectedArtistId}/albums?market=US&limit=10`, {
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
  
        setAlbums(data.items || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching artist albums:', error);
        Alert.alert('Error', 'Failed to fetch artist albums. Please try again.');
      }
    };
  
    const fetchAlbumTracks = async (albumId) => {
        try {
          const accessToken = await getAccessToken();
    
          const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?market=US`, {
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
    
          // Handle the tracks data as needed
        } catch (error) {
          console.error('Error fetching album tracks:', error);
          Alert.alert('Error', 'Failed to fetch album tracks. Please try again.');
        }
      };
  
    const handleAlbumPress = (albumId) => {
      // Fetch tracks for the selected album
      fetchAlbumTracks(albumId);
    };
  
    const renderAlbumItem = ({ item }) => (
      <TouchableOpacity onPress={() => handleAlbumPress(item.id)}>
        <View style={styles.albumCard}>
          <Text style={styles.albumName}>{item.name}</Text>
          {/* Add more album information as needed */}
        </View>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.container}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={albums}
            keyExtractor={(item) => item.id}
            renderItem={renderAlbumItem}
          />
        )}
      </View>
    );
  };
  
  export default PlaylistGenerator;
