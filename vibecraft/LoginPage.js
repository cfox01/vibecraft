import{ Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';


export default function Login() {
  return (
      <Button mode="contained" style = {styles.button}>Login</Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    width: '40%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
