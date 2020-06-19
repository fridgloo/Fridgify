import React from "react";
import { Text, StyleSheet, View, TouchableOpacity} from "react-native";

import Colors from "../constants/Colors";

// In case you're wondering : https://reactnative.dev/docs/touchableopacity

//prop passed in: title - the text that will be displayed on the button.
//                onPress - the function that will run when the button is pressed.
//                color - color of the button. Default = primaryColor
function AuthButton({ title, onPress, color = "primaryColor" }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: Colors[color] }]} // Overrides stylesheet color with parameter.
      onPress={onPress}
    >  
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>  
  );
}

const styles = StyleSheet.create({
  button: {
    // Will follow whatever color scheme is in the constants folder
    backgroundColor: Colors.primaryColor,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    padding : 15,
    marginBottom: 10,
    marginLeft: "20%",
    marginRight: "20%",

  },
  text: {
    color: Colors.white, //comes from color.js file
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "normal",
    textAlign: "center",
  },
});

export default AuthButton;
