import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import Screen from "../components/Screen";
import TabHeader from "../components/TabHeader";
import ScreenContent from "../components/ScreenContent";
import GlistList from "../components/GlistList";
import HubModal from "../components/modals/HubModal";

import routes from "../navigation/routes";
import glistsApi from "../api/glist";
import itemsApi from "../api/item";

export default function GlistHubScreen({ navigation, route }) {
  const getGlistsApi = useApi(glistsApi.getGlists);
  const getGlistItemsApi = useApi(itemsApi.getGlistItems);
  const [glists, setGlists] = useState([]);
  const [modal, setModal] = useState({
    visible: false,
    option: "",
    value: "",
  });

  useEffect(() => {
    getGlistsApi.request();
  }, [route.params?.changed, glists]);

  const handleAddGlist = async (newName) => {
    const result = await glistsApi.addGlist({ name: newName });
    if (result.ok) setGlists((prev) => [...prev, result.data]);
    else {
      console.log(result.data.error);
      alert(`Could not add Grocery List - ${result.data.error}`);
    }
  };

  const handleSend = async (id) => {
    getGlistItemsApi.request(id);
    if (!getGlistItemsApi.error) {
      itemsApi.addGlistItem({
        items: getGlistItemsApi.data.items,
        glist: getGlistItemsApi.data[0]._id,
      });
    } else {
      console.log(getGlistItemsApi.error);
      alert(`Could not send to Fridge - ${getGlistItemsApi.error}`);
    }
  };

  const onToggleModal = (option, value) => {
    setModal((prevState) => ({
      ...prevState,
      visible: !prevState.visible,
      option: option,
      value: value,
    }));
  };

  return (
    <Screen style={styles.screen}>
      <HubModal
        modalState={modal}
        toggleModal={onToggleModal}
        handleSubmit={handleAddGlist}
        handleSend={handleSend}
        container={"List"}
      />
      <TabHeader>Grocery Hub</TabHeader>
      <ScreenContent style={styles.shoppingScreen} header={"Shopping Cart"}>
        <TouchableOpacity
          style={styles.shopping}
          onPress={() => navigation.navigate(routes.SHOPPING_CART, glists[0])}
        >
          <ImageBackground
            style={styles.shoppingIG}
            imageStyle={styles.image}
            resizeMode={"cover"}
            source={require("../assets/images/grocery.jpg")}
          >
            <FontAwesome5
              style={styles.iconSpace}
              name={"shopping-cart"}
              size={40}
              color={"white"}
            />
            <FontAwesome5
              style={styles.iconSpace}
              name={"chevron-right"}
              size={35}
              color="white"
            />
          </ImageBackground>
        </TouchableOpacity>
      </ScreenContent>
      <ScreenContent
        style={styles.glist}
        header={"Your Grocery Lists"}
        toggleModal={onToggleModal}
      >
        <GlistList
          glists={glists.slice(1)}
          onPress={(glist) =>
            navigation.navigate(routes.GLIST_DETAILS, {
              glist: glist,
              cart: glists[0]._id,
            })
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
  shoppingScreen: {
    height: "30%",
  },
  shopping: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: "85%",
    height: "100%",
  },
  shoppingIG: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  image: {
    borderRadius: 15,
  },
  iconSpace: {
    paddingRight: 15,
  },
  glist: {
    flex: 1,
  },
});
