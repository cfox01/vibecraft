import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';


const PlaylistPage = () => {
  const [searchText, setSearchText] = useState('Guest');

  const handleSearch = (text) => {
    // Handle your search logic here
    setSearchText(text);
    // For example, you can filter a list based on searchText
    // Update your filtered data or trigger an API call with the text
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
        placeholder="Artist Name Here..."
        onChangeText={handleSearch}
        value={searchText}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
});

export default PlaylistPage;
