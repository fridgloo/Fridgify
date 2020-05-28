import React from "react";
import { Button, TextInput, View } from "react-native";
import { AuthContext } from "../App";
import { validPassword, validUsername } from '../../shared';


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
    <View>
      <TextInput
        placeholder="Username"
        id="username"
        name="username"
        value={state.username}
        onChangeText={value => onChange('username', value)}
      />
      <TextInput
        placeholder="Password"
        id="password"
        name="password"
        value={state.password}
        onChangeText={value => onChange('password', value)}
        secureTextEntry
      />
      <TextInput
        placeholder="Email"
        id="email"
        name="email"
        value={state.email}
        onChangeText={value => onChange('email', value)}
      />
      <TextInput
        placeholder="First Name"
        id="first_name"
        name="first_name"
        value={state.first_name}
        onChangeText={value => onChange('first_name', value)}
      />
      <TextInput
        placeholder="Last Name"
        id="last_name"
        name="last_name"
        value={state.last_name}
        onChangeText={value => onChange('last_name', value)}
      />
      <Button title="Register" onPress={() => { signUp(state); navigation.navigate('SignIn'); }} />
    </View>
  );
}
