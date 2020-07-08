import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/Colors";

function ProfileInfo({ children, props }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.inputBox, props]}>{children}</Text>
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
    padding: 20,
  },
  inputBox: {
    padding: 0,
    borderWidth: 0,
    height: 20,
  },
});

export default ProfileInfo;
