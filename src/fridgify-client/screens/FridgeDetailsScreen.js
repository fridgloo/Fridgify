import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Text,
} from "react-native";
import Screen from "../components/Screen";
import ScreenHeader from "../components/ScreenHeader";
import BackHeader from "../components/BackHeader";

import colors from "../constants/colors";
import routes from "../navigation/routes";

import fridgesApi from "../api/fridge";
import itemsApi from "../api/item";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import ScreenModal from "../components/modals/ScreenModal";
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
    getFridgeItems();
  }, []);

  const getFridgeItems = async () => {
    await itemsApi
      .getFridgeItems(route.params._id)
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
          throw new Error("getFridgeItems fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteFridge = async () => {
    await fridgesApi
      .deleteFridge({ _id: fridge._id })
      .then((response) => {
        if (response.ok) {
          const changed = new Date();
          navigation.navigate(routes.FRIDGE_HUB, {
            changed: changed.toString(),
          });
        } else {
          throw new Error("deleteFridge fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const clearFridge = async () => {
    await itemsApi
      .deleteFridgeItem({ fridge: fridge._id, items: fridge.items })
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
    await fridgesApi
      .editFridge({ data: { primary: true }, _id: fridge._id })
      .then((response) => {
        if (response.ok) {
          const changed = new Date();
          navigation.navigate("FridgeHub", { changed: changed.toString() });
        } else {
          throw new Error("setPrimary fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const setItemElement = async (value) => {
    await itemsApi
      .editItem({ data: { [modal.option]: value }, _id: modal.value._id })
      .then((response) => {
        if (response.ok) {
          const index = fridge.items.findIndex((e) => e._id == modal.value._id);
          let newItems = fridge.items;
          newItems[index] = { ...newItems[index], [modal.option]: value };
          setFridge((prevState) => ({ ...prevState, items: newItems }));
        } else {
          throw new Error("setItemElement fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const addItem = async (item) => {
    await itemsApi
      .addFridgeItem({
        item: {
          name: item.name,
          type: item.type,
          exp_date: item.exp_date,
          bought_date: new Date(),
        },
        fridge: fridge._id,
      })
      .then((response) => {
        if (response.ok) {
          const option = Object.keys(fridge.filter);
          if (option.length === 1) {
            setFridge((prevState) => ({
              ...prevState,
              items: sortBy(
                option[0],
                [...prevState.items, response.data.item],
                !prevState.filter[option[0]]
              ),
            }));
          } else {
            setFridge((prevState) => ({
              ...prevState,
              items: [...prevState.items, response.data.item],
            }));
          }
        } else {
          throw new Error("addItem fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteItem = async (item) => {
    await itemsApi
      .deleteFridgeItem({ fridge: fridge._id, items: [item] })
      .then((response) => {
        if (response.ok) {
          const index = fridge.items.findIndex((e) => e._id == item._id);
          let newItems = fridge.items;
          newItems.splice(index, 1);
          setFridge((prevState) => ({ ...prevState, items: newItems }));
        } else {
          throw new Error("deleteItem fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const sortBy = (option, items, filter) => {
    const sorted_items = items;
    sorted_items.sort((a, b) => {
      a = a[option];
      b = b[option];
      if (option === "name") {
        a = a.toLowerCase();
        b = b.toLowerCase();
      } else if (option === "exp_date") {
        if (a === null) {
          a = new Date(0);
        }
        if (b === null) {
          b = new Date(0);
        }
        a = a.toString();
        b = b.toString();
      }
      return a > b ? (filter ? -1 : 1) : a < b ? (filter ? 1 : -1) : 0;
    });
    return sorted_items;
  };

  const sortByAndSet = (option) => {
    setFridge((prevState) => ({
      ...prevState,
      items: sortBy(option, fridge.items, prevState.filter[option]),
      filter: {
        [option]: !prevState.filter[option],
      },
    }));
  };

  const onToggleModal = (option, value) => {
    setModal((prevState) => ({
      ...prevState,
      option: option,
      value: value,
      visible: !prevState.visible,
    }));
  };
  return (
    <Screen style={styles.screen}>
      <ScreenModal
        modalState={modal}
        toggleModal={onToggleModal}
        setItemElement={setItemElement}
        addItem={addItem}
        setPrimary={setPrimary}
        clearContainer={clearFridge}
        deleteContainer={deleteFridge}
        container={"fridge"}
      />
      <BackHeader navigation={navigation} destination={routes.FRIDGE_HUB} />
      <ScreenHeader name={fridge.name} primary={fridge.primary}>
        <TouchableOpacity
          onPress={() => onToggleModal("primary")}
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
          style={styles.buttonSpace}
          onPress={() => onToggleModal("delete")}
        >
          <FontAwesome name={"trash"} size={25} color={colors.primaryColor} />
        </TouchableOpacity>
      </ScreenHeader>
      <ItemList
        items={fridge.items}
        deleteItem={deleteItem}
        showExpiration={true}
        sortByAndSet={sortByAndSet}
        onToggleModal={onToggleModal}
      >
        <TouchableOpacity
          style={styles.buttonSpace}
          onPress={() => onToggleModal("clear")}
        >
          <MaterialCommunityIcons
            name={"playlist-remove"}
            size={30}
            color={colors.primaryColor}
          />
        </TouchableOpacity>
      </ItemList>
      <TouchableHighlight
        style={styles.addItem}
        underlayColor={colors.primaryDisabled}
        onPress={() => onToggleModal("add_nte")}
      >
        <Text style={styles.addItemText}>Add Item</Text>
      </TouchableHighlight>
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
  buttonSpace: {
    paddingLeft: 15,
  },
  addItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: colors.primaryColor,
  },
  addItemText: {
    fontSize: 18,
    color: "white",
  },
});
