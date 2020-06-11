import React from "react";
import { FlatList, Dimensions, StyleSheet, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

export default function FridgeHubScreen({ navigation, route }) {
  const [state, setState] = React.useState({
    fridges: [],
  });

  React.useEffect(() => {
    getFridges();
  }, [route.params?.data]);

  const getFridges = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    const response = await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.ok) {
      resetFridges();
      data.fridges.map((fridge) => {
        const fridgeState = {
          id: fridge._id,
          name: fridge.name,
          created: fridge.created,
          items: fridge.items,
          primary: fridge.primary,
        };
        if (!fridgeState.primary) {
          setState((prev) => ({
            fridges: [...prev.fridges, fridgeState],
          }));
        } else {
          setState((prev) => ({
            fridges: [fridgeState, ...prev.fridges],
          }));
        }
      });
    }
  };

  const resetFridges = () => {
    setState((prev) => ({
      fridges: [],
    }));
  };

  const getFridgeBG = (index) => {
    let fridgeBG = "white";
    switch (index) {
      case 0:
        fridgeBG = "#3EB9BB";
        break;
      case 1:
        fridgeBG = "#70CDD2";
        break;
      case 2:
        fridgeBG = "#9ED9DE";
        break;
      case 3:
        fridgeBG = "#D1F1F6";
        break;
    }
    return fridgeBG;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: 20,
      }}
    >
      <View
        style={{
          flex: 4,
          top: 20,
          justifyContent: "top",
          alignItems: "center",
        }}
      >
        {state.fridges?.map((fridge, index) => {
          return (
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: getFridgeBG(index),
                borderRadius: 25,
                width: Math.round(Dimensions.get('window').width - 20),
                height: Math.round(Dimensions.get('window').height/8),
                margin: 2,
              }}
              key={index}
              onPress={() =>
                navigation.navigate("FridgeScreenStack", {
                  screen: "FridgeScreen",
                  params: { data: fridge, type: "INITIALIZE" },
                })
              }
            >
              <Text>{fridge.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={
            state.fridges.length >= 4
              ? styles.addFridgeDisabled
              : styles.addFridgeEnabled
          }
          onPress={() => navigation.navigate("AddFridgeModal")}
          disabled={state.fridges.length >= 4}
        >
          <Icon name={"plus"} size={30} color="white"></Icon>
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
    width: 75,
    height: 75,
    backgroundColor: "#177AEE",
    justifyContent: "center",
    alignItems: "center",
  },
  addFridgeDisabled: {
    borderWidth: 5,
    borderColor: "#7DADE5",
    borderRadius: 50,
    width: 75,
    height: 75,
    backgroundColor: "#85B2E6",
    justifyContent: "center",
    alignItems: "center",
  },
});
