import { DefaultTheme } from "@react-navigation/native";
import colors from "../constants/colors";

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primaryColor,
    background: colors.white,
  },
};
