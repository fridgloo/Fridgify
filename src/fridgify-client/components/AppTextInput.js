import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import colors from "../constants/colors";

function AppTextInput({ ...props }) {
  return (
    <View style={styles.container}>
      <TextInput style={styles.inputBox} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.textGray,
    justifyContent: "center",
    width: "80%",
    height: "7%",
    marginLeft: "10%",
    marginRight: "10%",
    marginBottom: 20,
    padding: 15,
    marginVertical: 10,
  },
  inputBox: {
    padding: 0,
    borderWidth: 0,
    height: 20,
  },
});

export default AppTextInput;
