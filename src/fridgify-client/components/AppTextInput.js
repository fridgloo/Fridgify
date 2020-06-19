import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

function AppTextInput({ ...props }) {
  return (
    <View style={styles.container}>
      <TextInput style={styles.inputBox} {...props} />
    </View>
  );
}

// Will follow whatever color scheme is in the constants folder
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.textGray,
    justifyContent: "center",
    width: "80%",
    height: "7%",
    marginLeft: "10%",
    marginRight: "10%",
    marginBottom: 20,
    padding: 20,
  },
  inputBox: {
    padding: 0,
    borderWidth: 0,
    height: 20,
  },
});

export default AppTextInput;
