import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import Login from './LoginPage';
import Logo from './Logo';

const PlaceholderImage = require('./assets/circle.png');

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Logo placeholderImageSource={PlaceholderImage} />
      </View>
      <View style={styles.footer}>
        <Login/>
      </View>
      <View>
        <StatusBar style="auto"/>
      </View>
    </PaperProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cc66ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex:2 / 5,
    backgroundColor: '#cc66ff',
    alignItems: 'center',
  },
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#121338',
    secondary: '#00d19f',
  },
};