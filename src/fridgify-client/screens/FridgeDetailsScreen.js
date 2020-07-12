import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Button,
  TouchableHighlight,
  Picker,
  TextInput,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import ScreenContent from "../components/ScreenContent";
import BackHeader from "../components/BackHeader";

import colors from "../constants/colors";

import fridgesApi from "../api/fridge";
import itemsApi from "../api/item";
import authStorage from "../auth/storage";
import LogoText from "../components/LogoText";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  formatDate,
  getExpirationColor,
  getItemType,
} from "../util/ScreenHelpers";
import FridgeModal from "../components/modals/FridgeModal";
import ItemList from "../components/ItemList";

export default function FridgeDetailsScreen({ navigation, route }) {
  const [fridge, setFridge] = useState({
    _id: "",
    items: [],
    name: "",
    primary: false,
    filter: {},
  });
  const [modal, setModal] = useState({
    visible: false,
    option: "",
    value: "",
  });

  useEffect(() => {
    getTokenAndFridge();
  }, []);

  const getTokenAndFridge = async () => {
    const authToken = await authStorage.getToken();
    await itemsApi
      .getFridgeItems(route.params._id, authToken)
      .then((response) => {
        if (response.ok) {
          setFridge((prevState) => ({
            ...prevState,
            _id: route.params._id,
            items: response.data.items,
            name: route.params.name,
            primary: route.params.primary,
          }));
        } else {
          throw new Error("getTokenAndItems fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteFridge = async () => {
    const authToken = await authStorage.getToken();
    await fridgesApi
      .deleteFridge(fridge._id, authToken)
      .then((response) => {
        if (response.ok) {
          navigation.navigate("FridgeHub");
        } else {
          throw new Error("deleteFridge fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const clearFridge = async () => {
    const authToken = await authStorage.getToken();
    await itemsApi
      .deleteFridgeItem({ fridge: fridge._id, items: fridge.items }, authToken)
      .then((response) => {
        if (response.ok) {
          setFridge((prevState) => ({
            ...prevState,
            items: [],
          }));
        } else {
          throw new Error("clearFridge fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const setPrimary = async () => {
    const authToken = await authStorage.getToken();
    await fridgesApi
      .editFridge({ data: { primary: true }, _id: fridge._id }, authToken)
      .then((response) => {
        if (response.ok) {
          setFridge((prevState) => ({ ...prevState, primary: true }));
        } else {
          throw new Error("setPrimary fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const setItemElement = async (value, option) => {
    const authToken = await authStorage.getToken();
    await itemsApi
      .editItem({ data: { [option]: value }, _id: modal.value._id }, authToken)
      .then((response) => {
        if (response.ok) {
          const index = fridge.items.findIndex((e) => e._id == modal.value._id);
          let newItems = fridge.items;
          newItems[index] = { ...newItems[index], [option]: value };
          setFridge((prevState) => ({ ...prevState, items: newItems }));
        } else {
          throw new Error("setItemElement fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const addItem = async (item) => {
    const authToken = await authStorage.getToken();
    await itemsApi
      .addFridgeItem(
        {
          data: {
            name: item.name,
            type: item.type,
            exp_date: item.exp_date,
            bought_date: new Date(),
          },
          fridge: fridge._id,
        },
        authToken
      )
      .then((response) => {
        if (response.ok) {
          setFridge((prevState) => ({
            ...prevState,
            items: [...prevState.items, response.data.item],
          }));
        } else {
          throw new Error("addItem fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteItem = async (item) => {
    const authToken = await authStorage.getToken();
    await itemsApi
      .deleteFridgeItem({ fridge: fridge._id, items: [item] }, authToken)
      .then((response) => {
        if (response.ok) {
          const index = fridge.items.findIndex((e) => e._id == item._id);
          let newItems = fridge.items;
          newItems.splice(index, 1);
          setFridge((prevState) => ({ ...prevState, items: newItems }));
        } else {
          throw new Error("deleteItem fetch error");
        }
      });
  };

  const sortBy = (option) => {
    const items = fridge.items;
    console.log(fridge.filter);
    items.sort((a, b) =>
      a[option] < b[option]
        ? fridge.filter[option]
          ? -1
          : 1
        : a[option] > b[option]
        ? fridge.filter[option]
          ? 1
          : -1
        : 0
    );
    setFridge((prevState) => ({
      ...prevState,
      items: items,
      filter: {
        [option]: !prevState.filter[option],
      },
    }));
  };

  const toggleModal = () => {
    setModal((prevState) => ({ ...prevState, visible: !prevState.visible }));
  };

  return (
    <Screen style={styles.screen}>
      <BackHeader navigation={navigation} />
      <ScreenHeader name={fridge.name} primary={fridge.primary}>
        <TouchableOpacity
          onPress={() => setPrimary()}
          disabled={fridge.primary}
        >
          <FontAwesome
            name={"star"}
            size={25}
            color={
              fridge.primary ? colors.primaryDisabled : colors.primaryColor
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingLeft: 15 }}
          onPress={() => deleteFridge()}
        >
          <FontAwesome name={"trash"} size={25} color={colors.primaryColor} />
        </TouchableOpacity>
      </ScreenHeader>
      <ItemList
        items={fridge.items}
        deleteItem={deleteItem}
        showExpiration={true}
        sortBy={sortBy}
      >
        <TouchableOpacity style={{ paddingLeft: 15 }}>
          <MaterialCommunityIcons
            name={"playlist-remove"}
            size={30}
            color={colors.primaryColor}
          />
        </TouchableOpacity>
      </ItemList>
      <Button title={"Add Item"}></Button>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  fridgeName: {
    fontSize: 40,
    textAlign: "center",
  },
});
