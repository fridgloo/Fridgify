import React from "react";
import { Button, TextInput, View, SafeAreaView, Image, Text, StyleSheet} from "react-native"; 
import { AuthContext } from "../providers/AuthContextProvider";
import { validPassword, validUsername } from '../util/Validation';
import AuthButton from "../components/AuthButton";
import AppTextInput from "../components/AppTextInput";
import LogoText from "../components/LogoText";


export default function RegistrationScreen({ navigation }) {
  const [state, setState] = React.useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = React.useState('');

  const onChange = (name, value) => {
    setError('');
    // Update from form and clear errors
    setState({
      ...state,
      [name]: value
    });
    // Make sure the username is valid
    if (name === 'username') {
      let usernameInvalid = validUsername(value);
      if (usernameInvalid) setError(`Error: ${usernameInvalid.error}`);
    }
    // Make sure password is valid
    else if (name === 'password') {
      let pwdInvalid = validPassword(value);
      if (pwdInvalid) setError(`Error: ${pwdInvalid.error}`);
    }
  }


  const { signUp } = React.useContext(AuthContext);
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
      <LogoText style={styles.title}>Fridgloo </LogoText>

      <Text style={styles.loginIndicator}>Register</Text>
      <AppTextInput
        placeholder="Username"
        id="username"
        name="username"
        value={state.username}
        onChangeText={value => onChange('username', value)}
      />
      <AppTextInput
        placeholder="Password"
        id="password"
        name="password"
        value={state.password}
        onChangeText={value => onChange('password', value)}
        secureTextEntry
      />
      
      {/* Section for Confirm Password */}
      {/* <AppTextInput
        placeholder="Confirm Password"
        id="confirm_password"
        name="confirm_password"
        value={state.confirm_password}
        onChangeText={value => onChange('confirm_password', value)}
        secureTextEntry
      /> */} 

      <AppTextInput
        placeholder="Email"
        id="email"
        name="email"
        value={state.email}
        onChangeText={value => onChange('email', value)}
      />
      <AppTextInput
        placeholder="First Name"
        id="first_name"
        name="first_name"
        value={state.first_name}
        onChangeText={value => onChange('first_name', value)}
      />
      <AppTextInput
        placeholder="Last Name"
        id="last_name"
        name="last_name"
        value={state.last_name}
        onChangeText={value => onChange('last_name', value)}
      />
      <AuthButton title="Register" onPress={() => { signUp(state); }} />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 55,
    lineHeight: 68,
    textAlign: "center",
    padding: "10%",
    marginTop: "10%",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: "10%",
    marginBottom: "5%",
  },
  logo: {
    width: 50,
    height: 50,
  },
  loginIndicator: {
    fontFamily: "Avenir",
    fontSize: 15,
    marginLeft: "10%",
    marginBottom: 5,
  },
});
