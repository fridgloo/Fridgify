import React, { useEffect } from "react";
import { FlatList, Text, StyleSheet } from "react-native";

import Authstyles from "../constants/AuthStyles"; // Change this

import Screen from "../components/Screen";
import fridgesApi from "../api/fridges";
import useApi from "../hooks/useApi";
import authStorage from "../auth/storage";
import LogoText from "../components/LogoText";
import Fridge from "../components/Fridge";
import routes from "../navigation/routes";

export default function FridgeHubScreen({ navigation }) {
  const getFridgesApi = useApi(fridgesApi.getFridges);

  const getTokenAndFridges = async () => {
    const authToken = await authStorage.getToken();
    getFridgesApi.request(authToken);
  };

  useEffect(() => {
    getTokenAndFridges();
  }, []);

  return (
    <Screen style={styles.screen}>
      <LogoText style={Authstyles.title}>Fridge Hub</LogoText>
      <FlatList
        horizontal
        data={getFridgesApi.data.fridges}
        keyExtractor={(fridge) => fridge._id.toString()}
        renderItem={({ item }) => (
          <Fridge
            name={item.name}
            onPress={() => navigation.navigate(routes.FRIDGE_DETAILS, item)}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
});
