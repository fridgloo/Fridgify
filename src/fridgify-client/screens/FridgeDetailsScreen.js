import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
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
import fridgesApi from "../api/fridge";
import itemsApi from "../api/item";
import authStorage from "../auth/storage";
import LogoText from "../components/LogoText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  formatDate,
  getExpirationColor,
  getItemType,
} from "../util/ScreenHelpers";
import FridgeModal from "../components/modals/FridgeModal";
import {
  ListItem,
  ListItemDeleteAction,
  ListItemSeparator,
  ListSearchBar,
} from "../components/list";

export default function FridgeDetailsScreen({ navigation, route }) {
  const [fridge, setFridge] = useState({});
  const [search, setSearch] = useState("");
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
          setFridge({
            _id: route.params._id,
            items: response.data.items,
            name: route.params.name,
            primary: route.params.primary,
          });
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
          setFridge((prevState) => ({
            ...prevState,
            items: [],
          }));
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
          navigation.navigate("FridgeHub");
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

  const deleteItem = async (item) => {
    const authToken = await authStorage.getToken();
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
      });
  };

  const toggleModal = () => {
    setModal((prevState) => ({ ...prevState, visible: !prevState.visible }));
  };

  return (
    <Screen style={styles.screen}>
      <BackHeader navigation={navigation} />
      <ScreenHeader fridge={fridge} />
    </Screen>
    // <Screen style={styles.screen}>
    //   <View style={styles.container}>
    //     <LogoText style={styles.fridgeName}>{fridge.name}</LogoText>
    //     <MaterialCommunityIcons
    //       name="delete"
    //       size={30}
    //       onPress={() => promptUser()}
    //       color={"#2D82FF"}
    //     />
    //     <MaterialCommunityIcons
    //       name="star"
    //       size={30}
    //       onPress={() => setPrimary()}
    //       color={fridge.primary ? "#2D82FF" : "#A7CBFF"}
    //     />
    //   </View>
    //   <FlatList
    //     data={values}
    //     keyExtractor={(value) => value.id.toString()}
    //     renderItem={({ item }) => (
    //       <ListItem
    //         name={item.name}
    //         onPress={() => console.log("Message selected", item)}
    //         renderRightActions={() => (
    //           <ListItemDeleteAction onPress={() => handleDeleteItem(item)} />
    //         )}
    //       />
    //     )}
    //     ItemSeparatorComponent={ListItemSeparator}
    //     ListHeaderComponent={ListSearchBar}
    //     refreshing={refreshing}
    //     onRefresh={() => {
    //       setValues([
    //         {
    //           id: 2,
    //           name: "ramen",
    //         },
    //       ]);
    //     }}
    //   />
    //   <Text>{fridge.primary ? "Primary" : "Not Primary"}</Text>
    //   <Button title="Add Items" onPress={() => addItems()} />
    // </Screen>
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
  container: {
    flexDirection: "row",
    backgroundColor: "white",
  },
});
