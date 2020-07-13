import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import colors from "../constants/colors";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function Glist({ name, id, onPress, toggleModal }) {
  return (
    <TouchableOpacity style={styles.glist} onPress={onPress}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            width: "65%",
            fontWeight: "400",
            fontSize: 18,
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => toggleModal("send", id)}>
            <FontAwesome
              name={"send-o"}
              size={20}
              color={colors.primaryColor}
            />
          </TouchableOpacity>
          <FontAwesome5
            style={{ paddingLeft: 15 }}
            name={"chevron-right"}
            size={22}
            color={"black"}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  glist: {
    backgroundColor: colors.backgroundGray,
    width: Math.round(Dimensions.get("window").width - 80),
    height: 80,
    borderRadius: 15,
    marginVertical: 5,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
