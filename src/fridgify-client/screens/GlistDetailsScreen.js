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
import ScreenModal from "../components/modals/ScreenModal";
import ItemList from "../components/ItemList";

import colors from "../constants/colors";
import routes from "../navigation/routes";

import glistsApi from "../api/glist";
import itemsApi from "../api/item";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

export default function GlistDetailsScreen({ navigation, route }) {
  const [glist, setGlist] = useState({
    _id: "",
    items: [],
    name: "",
    filter: {},
  });
  const [modal, setModal] = useState({
    visible: false,
    option: "",
    value: "",
  });

  useEffect(() => {
    getGlistItems();
  }, []);

  const getGlistItems = async () => {
    await itemsApi
      .getGlistItems(route.params.glist._id)
      .then((response) => {
        if (response.ok) {
          setGlist((prevState) => ({
            ...prevState,
            _id: route.params.glist._id,
            items: response.data.items,
            name: route.params.glist.name,
          }));
        } else {
          throw new Error("getGlistItems fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const deleteGlist = async () => {
    await glistsApi
      .deleteGlist({ _id: glist._id })
      .then((response) => {
        if (response.ok) {
          const changed = new Date();
          navigation.navigate(routes.GLIST_HUB, {
            changed: changed.toString(),
          });
        } else {
          throw new Error("deleteGlist fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const clearGlist = async () => {
    await itemsApi
      .deleteGlistItem({ glist: glist._id, items: glist.items })
      .then((response) => {
        if (response.ok) {
          setGlist((prevState) => ({
            ...prevState,
            items: [],
          }));
        } else {
          throw new Error("clearGlist fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const setItemElement = async (value) => {
    await itemsApi
      .editItem({ data: { [modal.option]: value }, _id: modal.value._id })
      .then((response) => {
        if (response.ok) {
          const index = glist.items.findIndex((e) => e._id == modal.value._id);
          let newItems = glist.items;
          newItems[index] = { ...newItems[index], [modal.option]: value };
          setGlist((prevState) => ({ ...prevState, items: newItems }));
        } else {
          throw new Error("setItemElement fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const addItem = async (data) => {
    await itemsApi
      .addGlistItem({
        items: data,
        glist: glist._id,
      })
      .then((response) => {
        if (response.ok) {
          const option = Object.keys(glist.filter);
          if (option.length === 1) {
            setGlist((prevState) => ({
              ...prevState,
              items: sortBy(
                option[0],
                [...prevState.items, ...response.data.items],
                !prevState.filter[option[0]]
              ),
            }));
          } else {
            setGlist((prevState) => ({
              ...prevState,
              items: [...prevState.items, ...response.data.items],
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
      .deleteGlistItem({ glist: glist._id, items: [item] })
      .then((response) => {
        if (response.ok) {
          const index = glist.items.findIndex((e) => e._id == item._id);
          let newItems = glist.items;
          newItems.splice(index, 1);
          setGlist((prevState) => ({ ...prevState, items: newItems }));
        } else {
          throw new Error("deleteItem fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const sendToCart = async (id) => {
    await itemsApi
      .getGlistItems(id)
      .then((response) => {
        if (response.ok) {
          itemsApi.addGlistItem({
            items: response.data.items,
            glist: route.params.cart,
          });
        } else {
          throw new Error("handleSend fetch error");
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
    setGlist((prevState) => ({
      ...prevState,
      items: sortBy(option, glist.items, prevState.filter[option]),
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
        clearContainer={clearGlist}
        deleteContainer={deleteGlist}
        sendToCart={() => sendToCart(glist._id)}
        container={"grocery list"}
      />
      <BackHeader navigation={navigation} destination={routes.GLIST_HUB} />
      <ScreenHeader name={glist.name}>
        <TouchableOpacity onPress={() => onToggleModal("send")}>
          <FontAwesome name={"send"} size={20} color={colors.primaryColor} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSpace}
          onPress={() => onToggleModal("delete")}
        >
          <FontAwesome name={"trash"} size={25} color={colors.primaryColor} />
        </TouchableOpacity>
      </ScreenHeader>
      <ItemList
        items={glist.items}
        deleteItem={deleteItem}
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
        onPress={() => onToggleModal("add_nt")}
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
