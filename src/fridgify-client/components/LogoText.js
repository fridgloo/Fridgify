import React from "react";
import { Text } from "react-native";
import defaultStyles from "../constants/defaultStyles";

function LogoText({ children, style, ...otherProps }) {
  return (
    <Text style={[defaultStyles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

export default LogoText;
