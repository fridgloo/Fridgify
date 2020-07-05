import React, { useEffect } from "react";
import { FlatList, Text, StyleSheet, Button, View } from "react-native";

import Screen from "../components/Screen";
import LogoText from "../components/LogoText";
import Fridge from "../components/Fridge";
import routes from "../navigation/routes";

import fridgesApi from "../api/fridge";
import useApi from "../hooks/useApi";
import authStorage from "../auth/storage";

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
      <LogoText style={styles.title}>Fridge Hub</LogoText>
      <View style={styles.container}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={getFridgesApi.data.fridges}
          keyExtractor={(fridge) => fridge._id}
          renderItem={({ item }) => (
            <Fridge
              name={item.name}
              onPress={() => navigation.navigate(routes.FRIDGE_DETAILS, item)}
            />
          )}
        />
      </View>
      <Button
        title="Add Fridge"
        onPress={() => navigation.navigate("FridgeEdit")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  title: {
    fontSize: 50,
    lineHeight: 68,
    textAlign: "center",
    padding: "10%",
  },
  container: {
    height: "30%",
  },
});
