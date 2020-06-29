import React from "react";
import { Text } from "react-native";
import DefaultStyles from "../constants/DefaultStyles";

function LogoText({ children, style, ...otherProps }) {
  return (
    <Text style={[DefaultStyles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

export default LogoText;
