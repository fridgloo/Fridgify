import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import Screen from "../components/Screen";
import TabHeader from "../components/TabHeader";
import ScreenContent from "../components/ScreenContent";
import LogoText from "../components/LogoText";
import FridgeList from "../components/FridgeList";
import HubModal from "../components/modals/HubModal";

import routes from "../navigation/routes";
import fridgesApi from "../api/fridge";
import useApi from "../hooks/useApi";

export default function FridgeHubScreen({ navigation, route }) {
  const getFridgesApi = useApi(fridgesApi.getFridges);
  const [fridges, setFridges] = useState();
  const [modal, setModal] = useState({
    visible: false,
    option: "",
  });

  useEffect(() => {
    getFridgesApi.request();
  }, [route.params?.changed, fridges]);

  const handleAddFridge = async (newName) => {
    const result = await fridgesApi.addFridge({ name: newName });
    if (result.ok) setFridges((prev) => [...prev, result.data]);
    else {
      console.log(result.data.error);
      alert(`Could not add fridge - ${result.data.error}`);
    }
  };

  const onToggleModal = (option, value) => {
    setModal((prevState) => ({
      ...prevState,
      visible: !prevState.visible,
      option: option,
    }));
  };

  return (
    <Screen style={styles.screen}>
      {getFridgesApi.error && (
        <>
          <Text>Couldn't retrieve fridges.</Text>
          <Button title="Retry" onPress={getFridgesApi.request} />
        </>
      )}
      <HubModal
        modalState={modal}
        toggleModal={onToggleModal}
        handleSubmit={handleAddFridge}
        container={"Fridge"}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            height: 55,
            width: 55,
          }}
          resizeMode="center"
          source={require("../assets/images/iglooIcon.png")}
        />
        <TabHeader style={{ paddingLeft: 25 }}>Fridgloo</TabHeader>
      </View>
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
          fridges={getFridgesApi.data}
          onPress={(fridge) =>
            navigation.navigate(routes.FRIDGE_DETAILS, fridge)
          }
          toggleModal={onToggleModal}
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
    width: "85%",
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
