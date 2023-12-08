import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, FlatList, Keyboard } from 'react-native';
import { getAccessToken } from '../auth';
import { useRoute } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  playlistHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },
  playlistHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
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
});

const PlaylistGenerator = () => {
  const route = useRoute();
  const { selectedArtistId } = route.params;

  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');

  const handleGeneratePlaylist = async () => {
    try {

        Keyboard.dismiss();

      const accessToken = await getAccessToken();
      

      // Fetch artist albums
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
      const albums = data.items || [];

      // Use the entered playlist name and description
      const { playlistId, name, description } = await createPlaylistWithTracks(albums, accessToken);

      setPlaylistName(name);
      setPlaylistDescription(description);

      // Fetch tracks for the created playlist
      const playlistTracksResponse = await fetchPlaylistTracks(playlistId, accessToken);

      if (playlistTracksResponse.ok) {
        const playlistTracksData = await playlistTracksResponse.json();
        setPlaylistTracks(playlistTracksData.items || []);
      } else {
        throw new Error('Failed to fetch playlist tracks.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
    }
  };


  const createPlaylistWithTracks = async (albums, accessToken) => {
    try {

      const createPlaylistResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: playlistName,
          description: playlistDescription,
          public: false,
        }),
      });

      if (!createPlaylistResponse.ok) {
        throw new Error('Failed to create playlist.');
      }

      const playlistData = await createPlaylistResponse.json();
      const playlistId = playlistData.id;

      for (const album of albums) {
        const albumId = album.id;
        const tracksResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?market=US`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (tracksResponse.ok) {
          const tracksData = await tracksResponse.json();
          const trackIds = tracksData.items.map((track) => track.id);

          const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              uris: trackIds.map((id) => `spotify:track:${id}`),
            }),
          });

          if (!addTracksResponse.ok) {
            console.error('Failed to add tracks to the playlist.');
          }
        } else {
          console.error('Failed to fetch tracks for the album.');
        }
      }

      return { playlistId, name: playlistName, description: playlistDescription };
    } catch (error) {
      console.error('Error creating playlist:', error);
      Alert.alert('Error', 'Failed to create playlist. Please try again.');
      throw error;
    }
  };

  const fetchPlaylistTracks = async (playlistId, accessToken) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response;
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Playlist Name:</Text>
        <TextInput
          style={styles.input}
          value={playlistName}
          onChangeText={(text) => setPlaylistName(text)}
          placeholder="Enter Playlist Name"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Playlist Description:</Text>
        <TextInput
          style={styles.input}
          value={playlistDescription}
          onChangeText={(text) => setPlaylistDescription(text)}
          placeholder="Enter Playlist Description"
          multiline
          numberOfLines={4} // You can adjust the number of lines as needed
        />
      </View>
      <Button title="Generate Playlist" onPress={handleGeneratePlaylist} />
      {playlistTracks.length > 0 && (
        <View style={styles.playlistHeader}>
          <Text style={styles.playlistHeaderText}>Playlist Name: {playlistName}</Text>
          <Text style={styles.playlistHeaderText}>Playlist Description: {playlistDescription}</Text>
          <FlatList
            data={playlistTracks}
            keyExtractor={(item) => item.track.id}
            renderItem={({ item }) => (
              <View style={styles.albumCard}>
                <Text style={styles.albumName}>{item.track.name}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default PlaylistGenerator;