import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getAccessToken } from '../auth';


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
    borderColor: 'black',
    borderWidth: 3,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white', //Dark gray
  },
  playlistHeader: {
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  playlistHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  albumCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#D4C4FB',
    borderRadius: 10,
    elevation: 3,
  },
  albumName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  customButton: {
    backgroundColor: '#43464B', 
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 0,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingButton: {
    // backgroundColor: 'yellow',
  },
  completeButton: {
    backgroundColor: '#2BAE31',
  },
  completeButtonText: {
    color: 'white', 
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
    const [loading, setLoading] = useState(false); // New state for loading indicator
    const [completed, setCompleted] = useState(false); // New state for completed state
  

  const handleGeneratePlaylist = async () => {
    try {
      setLoading(true); // Set loading to true when starting API call
  
      Keyboard.dismiss();
  
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
      const albums = data.items || [];
  
      const { playlistId, name, description } = await createPlaylistWithTracks(albums, accessToken);
  
      setPlaylistName(name);
      setPlaylistDescription(description);
  
      const playlistTracksResponse = await fetchPlaylistTracks(playlistId, accessToken);
  
      if (playlistTracksResponse.ok) {
        const playlistTracksData = await playlistTracksResponse.json();
        setPlaylistTracks(playlistTracksData.items || []);
      } else {
        throw new Error('Failed to fetch playlist tracks.');
      }
  
      setLoading(false); // Set loading to false when API call is complete
      setCompleted(true); // Set completed to true when API call is complete
    } catch (error) {
      console.error('Error:', error);
      // Handle error appropriately
      setLoading(false); // Set loading to false in case of error
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
      <View style={styles.container}>
        <View style={[styles.inputContainer, { marginBottom: 20 }]}>
          <Text style={styles.playlistHeaderText}>Playlist Name:</Text>
          <TextInput
            style={[styles.input, styles.darkBackground]} // Applying dark background style
            value={playlistName}
            onChangeText={(text) => setPlaylistName(text)}
            placeholder="..."
            placeholderTextColor={'black'} // Light gray
          />
        </View>
        <View style={[styles.inputContainer, { marginBottom: 20 }]}>
          <Text style={styles.playlistHeaderText}>Playlist Description:</Text>
          <TextInput
            style={[styles.input, styles.darkBackground]} // Applying dark background style
            value={playlistDescription}
            onChangeText={(text) => setPlaylistDescription(text)}
            placeholder="..."
            placeholderTextColor={'black'} // Light gray
            multiline
            numberOfLines={4}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.customButton,
            loading && styles.customButton, // Apply loading styles if loading is true
            completed && styles.completeButton, // Apply completed styles if completed is true
          ]}
          onPress={handleGeneratePlaylist}
          disabled={loading || completed} // Disable button during loading and completed states
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.completeButtonText}>
              {completed ? 'Complete' : 'Generate Playlist'}
            </Text>
          )}
        </TouchableOpacity>
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
    </LinearGradient>
  );
};

export default PlaylistGenerator;