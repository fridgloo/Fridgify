import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import colors from "../../constants/colors";
import {
  formatDate,
  getItemType,
  getExpirationColor,
} from "../../util/ScreenHelpers";

export default function ListItem({
  data,
  checked,
  checkItem,
  showCheckBox,
  showExpiration,
  onToggleModal,
}) {
  return (
    <View
      style={[
        styles.container,
        { borderTopWidth: data.index === 0 ? 0.5 : 0 },
        showCheckBox ? { paddingLeft: 0 } : null,
      ]}
    >
      {showCheckBox && (
        <View style={styles.checkBox}>
          <CheckBox
            center
            checked={checked.includes(data.item._id)}
            onPress={() => checkItem(data.item._id)}
            checkedColor={colors.primaryColor}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.name}
        onPress={() => onToggleModal("name", data.item)}
      >
        <Text style={{ fontSize: 18 }} numberOfLines={1}>
          {data.item.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.type}
        onPress={() => onToggleModal("type", data.item)}
      >
        <FontAwesome5 name={getItemType(data.item.type)} size={20} />
      </TouchableOpacity>
      {showExpiration && (
        <View style={styles.expiration}>
          <FontAwesome
            style={styles.expirationIndicator}
            name={"circle"}
            color={getExpirationColor(data.item.exp_date)}
          />
          <TouchableOpacity
            style={styles.expirationDate}
            onPress={() => onToggleModal("exp_date", data.item)}
          >
            {data.item.exp_date || data.item.exp_date === "" ? (
              <Text numberOfLines={1}>{formatDate(data.item.exp_date)}</Text>
            ) : (
              <FontAwesome name={"calendar-o"} size={24} />
            )}
          </TouchableOpacity>
        </View>
      )}
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
  checkBox: {
    flex: 0.2,
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
