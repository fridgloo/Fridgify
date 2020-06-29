import Colors from "./Colors";
import { Platform } from "react-native";

export default {
  Colors,
  text: {
    color: Colors.primaryColor,
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
    fontWeight: "bold",
    fontStyle: "normal",
  },
};
