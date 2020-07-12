import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  formatDate,
  getItemType,
  getExpirationColor,
} from "../../util/ScreenHelpers";

export default function ListLabels({ showExpiration, sortBy }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.name} onPress={() => sortBy("name")}>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Name</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.type} onPress={() => sortBy("type")}>
        <Text style={{ fontSize: 14, fontWeight: "bold" }}>Type</Text>
      </TouchableOpacity>
      {showExpiration ? (
        <TouchableOpacity style={styles.exp} onPress={() => sortBy("exp")}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Expiration</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderColor: "#CBCBCB",
    borderBottomWidth: 0.5,
  },
  name: {
    flex: 1,
  },
  type: {
    flex: 0.2,
    alignItems: "center",
  },
  exp: {
    flex: 0.55,
    alignItems: "center",
  },
});
