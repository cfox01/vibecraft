import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

import Login from './LoginPage';
import Logo from './Logo';

const PlaceholderImage = require('./assets/circle.png');

export default function App() {
  return (
    <PaperProvider>
      <LinearGradient
        colors={[
          'rgba(18,19,56,1)',
          'rgba(18,19,56,1)',
          'rgba(18,19,56,1)',
          'rgba(17,36,65,1)',
          'rgba(16,47,71,1)',
          'rgba(15,53,74,1)',
          'rgba(13,70,83,1)',
          'rgba(12,84,91,1)',
          'rgba(9,109,104,1)',
          'rgba(8,120,110,1)',
          'rgba(6,142,122,1)',
          'rgba(4,162,133,1)',
          'rgba(3,176,141,1)',
          'rgba(1,195,152,1)',
          'rgba(0,209,159,1)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.containerContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Logo placeholderImageSource={PlaceholderImage} />
          </View>

          {/* Add space between Logo and Login */}
          <View style={styles.spaceBetween} />

          {/* Login */}
          <View style={styles.loginContainer}>
            <Login />
          </View>
        </View>
      </LinearGradient>

      <StatusBar style="auto" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContent: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginTop: 150,
    marginBottom: 20, 
  },
  spaceBetween: {
    height: 18, 
  },
  loginContainer: {
    height: 300,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
