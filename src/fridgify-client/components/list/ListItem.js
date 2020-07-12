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

export default function ListItem({ data, showExpiration }) {
  return (
    <View
      style={[styles.container, { borderTopWidth: data.index === 0 ? 0.5 : 0 }]}
    >
      <TouchableOpacity style={styles.name}>
        <Text style={{ fontSize: 18 }} numberOfLines={1}>
          {data.item.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.type}>
        <FontAwesome5 name={getItemType(data.item.type)} size={20} />
      </TouchableOpacity>
      {showExpiration ? (
        <View style={styles.expiration}>
          <FontAwesome
            style={styles.expirationIndicator}
            name={"circle"}
            color={getExpirationColor(data.item.exp_date)}
          />
          <TouchableOpacity style={styles.expirationDate}>
            {data.item.exp_date ? (
              <Text numberOfLines={1}>{formatDate(data.item.exp_date)}</Text>
            ) : (
              <FontAwesome name={"calendar-o"} size={24} />
            )}
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "#CBCBCB",
    borderWidth: 1,
    backgroundColor: "white",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  name: {
    flex: 1,
  },
  type: {
    flex: 0.2,
    alignItems: "center",
  },
  expiration: {
    flex: 0.55,
    flexDirection: "row",
    alignItems: "center",
  },
  expirationIndicator: {
    width: "12%",
  },
  expirationDate: {
    width: "88%",
    alignItems: "center",
  },
});
