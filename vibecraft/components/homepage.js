import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = ({ navigation }) => {
  const handleButtonClick = () => {
    // Navigate to the "Playlist" page when the button is clicked
    navigation.navigate('Playlist');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/circle.png')} style={styles.logo} />
        <Text style={styles.headerText}>User Name</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>+ Generate Playlist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#242424',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 80,
    marginRight: 200,
  },
  logo: {
    width: 50, // Set the width of your logo
    height: 50, // Set the height of your logo
    marginRight: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#01C092',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
    // Add a linear gradient for a glossy effect
    backgroundGradient: {
      colors: ['#2AC940', '#219C30'],
      start: { x: 0.5, y: 0 },
      end: { x: 0.5, y: 1 },
    },
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomePage;


