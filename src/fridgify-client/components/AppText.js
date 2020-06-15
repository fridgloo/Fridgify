import React from "react";
import { Text } from "react-native";
import Styles from "../constants/Styles";

function AppText({ children, style, ...otherProps }) {
  return (
    <Text style={[Styles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

export default AppText;
