import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

import colors from "../constants/colors";

function AuthButton({ title, onPress, color = "primaryColor" }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]} // Overrides stylesheet color with parameter.
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryColor,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    padding: 15,
    marginBottom: 10,
    marginLeft: "20%",
    marginRight: "20%",
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    textAlign: "center",
  },
});

export default AuthButton;
