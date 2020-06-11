import React from "react";
import {
  TouchableOpacity,
  FlatList,
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome";

export default function FridgeScreen({ navigation, route }) {
  const [state, setState] = React.useState({
    id: "",
    name: "",
    created: "",
    primary: false,
    items: [],
  });

  React.useEffect(() => {
    if (route.params?.type === "INITIALIZE") {
      fillFridgeState(route.params?.data);
    } else {
      fillFridgeState(state);
    }
  }, [route.params?.data]);

  const fillFridgeState = async (params) => {
    let token = await SecureStore.getItemAsync("user_token");
    const response = await fetch(
      `http://localhost:3200/v1/item/fridge/${params.id}/${token}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setState((prev) => ({
        id: params.id,
        name: params.name,
        created: params.created,
        primary: params.primary,
        items: data.items,
      }));
    }
  };

  const resetFridgeState = async () => {
    setState((prev) => ({
      id: "",
      name: "",
      created: "",
      primary: false,
      items: [],
    }));
  };

  const deleteFridge = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: state.id }),
    }).then(() =>
      navigation.navigate("FridgeHub", { data: state.id, type: "DELETE" })
    );
  };

  function Item({ info }) {
    return (
      <View>
        <TouchableOpacity
          style={{
            borderColor: "#CBCBCB",
            borderWidth: 1,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "left",
            margin: 1,
            width: Math.round(Dimensions.get("window").width - 20),
            height: Math.round(Dimensions.get("window").height / 25),
          }}
        >
          <Text style={{ paddingLeft: 30 }}>{info.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flex: 7,
          alignItems: "top",
        }}
      >
        <View
          style={{
            padding: 5,
            paddingLeft: 10,
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "flex-start",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 30,
              color: "#177AEE",
            }}
          >
            {state.name}
          </Text>
          <Text style={{ fontSize: 15, paddingLeft: 10 }}>
            {state.primary ? "Default" : ""}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Button title="Delete Fridge" onPress={() => deleteFridge()} />
          <Button title="Edit Fridge" />
        </View>
        <View
          style={{
            flex: 8,
            padding: 10,
          }}
        >
          {/* {state.items?.map((item, index) => {
            return <Text key={index} title={item.name}></Text>;
          })} */}
          <SafeAreaView>
            <FlatList
              data={state.items}
              renderItem={({ item }) => <Item info={item} />}
              keyExtractor={(item) => item._id}
            />
          </SafeAreaView>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={styles.addFridgeEnabled}
          onPress={() =>
            navigation.navigate("AddItemFromFridgeModal", { fridge: state.id })
          }
        >
          <Text style={{ fontSize: 20, color: "white" }}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addFridgeEnabled: {
    borderWidth: 5,
    borderColor: "#0771ED",
    borderRadius: 50,
    width: "30%",
    height: "80%",
    backgroundColor: "#177AEE",
    justifyContent: "center",
    alignItems: "center",
  },
  addFridgeDisabled: {
    borderWidth: 5,
    borderColor: "#7DADE5",
    borderRadius: 50,
    width: "30%",
    height: "80%",
    backgroundColor: "#85B2E6",
    justifyContent: "center",
    alignItems: "center",
  },
});
