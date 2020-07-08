import { DefaultTheme } from "@react-navigation/native";
import colors from "../constants/Colors";

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primaryColor,
    background: colors.white,
  },
};
