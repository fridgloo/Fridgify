import colors from "./Colors";
import { Platform } from "react-native";

export default {
  colors,
  text: {
    color: colors.primaryColor,
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
    fontWeight: "bold",
    fontStyle: "normal",
  },
};
