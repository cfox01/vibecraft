import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Homepage = () => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the home screen!</Text>
      {/* Add more content as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Homepage;
