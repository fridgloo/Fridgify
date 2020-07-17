import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Screen from "../components/Screen";
import BackHeader from "../components/BackHeader";
import ScreenModal from "../components/modals/ScreenModal";
import ItemList from "../components/ItemList";

import colors from "../constants/colors";
import routes from "../navigation/routes";

import fridgesApi from "../api/fridge";
import glistsApi from "../api/glist";
import itemsApi from "../api/item";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LogoText from "../components/LogoText";

export default function ShoppingCartScreen({ navigation, route }) {
  const [glist, setGlist] = useState({
    _id: "",
    items: [],
    checked: [],
    filter: {},
  });
  const [modal, setModal] = useState({
    visible: false,
    option: "",
    value: "",
    newName: "",
    newType: "",
    fridges: [],
  });

  useEffect(() => {
    getShoppingCartItems();
  }, []);

  const getShoppingCartItems = async () => {
    await itemsApi
      .getGlistItems(route.params._id)
      .then((response) => {
        if (response.ok) {
          setGlist((prevState) => ({
            ...prevState,
            _id: route.params._id,
            items: response.data.items,
            name: route.params.name,
          }));
        } else {
          throw new Error("getShoppingCartItems fetch error");
        }
      })
      .catch((error) => console.log(error));
  };

  const clearShoppingCart = async () => {
    await itemsApi
      .deleteGlistItem({ glist: glist._id, items: glist.items })
      .then((response) => {
        if (response.ok) {
          setGlist((prevState) => ({
            ...prevState,
            items: [],
          }));
        } else {
          throw new Error("clearShoppingCart fetch error");
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

  const submitToFridge = async (fridge_id) => {
    await glistsApi
      .submitGlist({
        items: glist.checked,
        fridge: fridge_id,
        glist: glist._id,
      })
      .then((response) => {
        if (response.ok) {
          setGlist((prevState) => ({
            ...prevState,
            items: prevState.items.filter(
              (item) => !prevState.checked.includes(item._id)
            ),
            checked: [],
          }));
        } else {
          throw new Error("submitToFridge");
        }
      })
      .catch((error) => console.log(error));
  };

  const loadSubmitModal = async () => {
    await fridgesApi
      .getFridges()
      .then((response) => {
        if (response.ok) {
          setModal((prevState) => ({
            ...prevState,
            visible: true,
            option: "submit",
            fridges: response.data,
          }));
        } else {
          throw new Error("loadSubmitModal fetch error");
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

  const checkItem = (item) => {
    const { checked } = glist;

    if (!checked.includes(item)) {
      setGlist((prevState) => ({
        ...prevState,
        checked: [...prevState.checked, item],
      }));
    } else {
      setGlist((prevState) => ({
        ...prevState,
        checked: prevState.checked.filter((a) => a !== item),
      }));
    }
  };

  const checkAll = () => {
    const resultArray = [];
    if (glist.checked.length < glist.items.length) {
      glist.items.map((item) => {
        resultArray.push(item._id);
      });
    }
    setGlist((prevState) => ({
      ...prevState,
      checked: resultArray,
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
        clearContainer={clearShoppingCart}
        submitToFridge={submitToFridge}
        container={"shopping cart"}
      />
      <BackHeader navigation={navigation} destination={routes.GLIST_HUB} />
      <LogoText style={styles.header}>Shopping Cart</LogoText>
      <ItemList
        items={glist.items}
        deleteItem={deleteItem}
        showCheckBox={true}
        checked={glist.checked}
        checkItem={checkItem}
        sortByAndSet={sortByAndSet}
        onToggleModal={onToggleModal}
      >
        <TouchableOpacity style={styles.buttonSpace} onPress={() => checkAll()}>
          <MaterialCommunityIcons
            name={"check-all"}
            size={25}
            color={colors.secondaryColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSpace}
          onPress={() => onToggleModal("clear")}
        >
          <MaterialCommunityIcons
            name={"playlist-remove"}
            size={30}
            color={colors.secondaryColor}
          />
        </TouchableOpacity>
      </ItemList>
      <View style={{ flexDirection: "row" }}>
        <TouchableHighlight
          style={styles.addItem}
          underlayColor={colors.secondaryDisabled}
          onPress={() => onToggleModal("add_nt")}
        >
          <Text style={styles.addItemText}>Add Item</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[
            styles.addItem,
            glist.checked.length === 0
              ? { backgroundColor: colors.secondaryDisabled }
              : null,
          ]}
          underlayColor={colors.secondaryDisabled}
          onPress={() => loadSubmitModal()}
          disabled={glist.checked.length === 0}
        >
          <Text style={styles.addItemText}>Submit To...</Text>
        </TouchableHighlight>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "white",
  },
  header: {
    fontSize: 36,
    color: colors.secondaryColor,
    textAlign: "center",
  },
  buttonSpace: {
    paddingLeft: 15,
  },
  addItem: {
    width: "50%",
    borderColor: "white",
    borderWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: colors.secondaryColor,
  },
  addItemText: {
    fontSize: 18,
    color: "white",
  },
});
