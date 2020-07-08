import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import Screen from "../components/Screen";
import TabHeader from "../components/TabHeader";
import ScreenContent from "../components/ScreenContent";
import FridgeList from "../components/FridgeList";
import FridgeHubModal from "../components/modals/FridgeHubModal";

import routes from "../navigation/routes";
import fridgesApi from "../api/fridge";
import authStorage from "../auth/storage";

export default function FridgeHubScreen({ navigation }) {
  const [fridges, setFridges] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getTokenAndFridges();
  }, []);

  const getTokenAndFridges = async () => {
    const authToken = await authStorage.getToken();
    await fridgesApi
      .getFridges(authToken)
      .then((response) => {
        if (response.ok) {
          return response.data;
        } else {
          throw new Error("getTokenAndFridges fetch error");
        }
      })
      .then((data) => setFridges(data.fridges))
      .catch((error) => console.log(error));
  };

  const handleAddFridge = async (newName) => {
    const authToken = await authStorage.getToken();
    await fridgesApi
      .addFridge({ name: newName }, authToken)
      .then((response) => {
        if (response.ok) {
          return response.data;
        } else {
          throw new Error("handleAddFridge fetch error");
        }
      })
      .then((data) => setFridges((prevState) => [...prevState, data]))
      .catch((error) => console.log(error));
  };

  const toggleModal = () => {
    setModalVisible((prevState) => !prevState);
  };

  return (
    <Screen style={styles.screen}>
      <FridgeHubModal
        visible={modalVisible}
        toggleModal={toggleModal}
        handleSubmit={handleAddFridge}
      />
      <TabHeader>Fridge Hub</TabHeader>
      <ScreenContent header={"Expiration Overview"}>
        <TouchableOpacity style={styles.expiration}>
          <View style={styles.overview}>
            <Text style={styles.overviewTitle}>1 day left</Text>
            <Text style={styles.overviewDesc}>Your yogurt is expiring</Text>
          </View>
          <View style={styles.goto}>
            <FontAwesome5
              name={"exclamation-triangle"}
              size={40}
              color="#FF7F23"
            />
            <FontAwesome5
              name={"chevron-right"}
              size={25}
              color="black"
              style={{ paddingLeft: 15 }}
            />
          </View>
        </TouchableOpacity>
      </ScreenContent>
      <ScreenContent header={"Your Fridges"}>
        <FridgeList
          fridges={fridges}
          onPress={(fridge) =>
            navigation.navigate(routes.FRIDGE_DETAILS, fridge)
          }
          toggleModal={toggleModal}
        />
      </ScreenContent>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  expiration: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 20,
    backgroundColor: "#F1F3F6",
    width: "90%",
    height: "100%",
    paddingHorizontal: 20,
  },
  overview: {
    flex: 2,
    justifyContent: "center",
  },
  overviewTitle: {
    fontWeight: "600",
    fontSize: 25,
    paddingBottom: 15,
  },
  overviewDesc: {
    fontSize: 15,
  },
  goto: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
