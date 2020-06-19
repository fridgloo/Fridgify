import React from "react";
import {
  TouchableOpacity,
  TouchableHighlight,
  Picker,
  Button,
  TextInput,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SwipeListView } from "react-native-swipe-list-view";
import * as SecureStore from "expo-secure-store";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function FridgeScreen({ navigation, route }) {
  const [state, setState] = React.useState({
    id: "",
    name: "",
    created: "",
    primary: false,
    changed: false,
    items: [],
    search: "",
    filter: {},
  });
  const [modal, setModal] = React.useState({
    visible: false,
    style: "",
    value: "",
    newValue: "",
    newType: "",
    newDate: new Date(),
    changed: false,
  });

  React.useEffect(() => {
    if (route.params?.type === "INITIALIZE") {
      fillFridgeState(route.params?.data);
    } else {
      fillFridgeState(state);
    }
  }, [route.params?.data]);

  const fillFridgeState = async (params) => {
    let token = await SecureStore.getItemAsync("user_token");
    const response = await fetch(
      `http://localhost:3200/v1/item/fridge/${params.id}/${token}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setState((prev) => ({
        ...prev,
        id: params.id,
        name: params.name,
        created: params.created,
        primary: params.primary,
        items: data.items,
      }));
    }
  };

  const deleteFridge = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: state.id }),
    }).then(() =>
      navigation.navigate("FridgeHub", { data: state.id, type: "DELETE" })
    );
  };

  const clearFridge = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { items: [] }, id: state.id }),
    })
      .then(
        async () =>
          await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fridge: state.id, items: state.items }),
          })
      )
      .then(() => setState((prevState) => ({ ...prevState, items: [] })));
  };

  const addItem = async (data) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data, fridge: state.id }),
    }).then(() => fillFridgeState(state));
    // .then((response) => response.json())
    // .then((data) => {
    //     setState((prevState) => ({
    //       ...prevState,
    //       items: [...prevState.items, data.item],
    //     }));
    //   });
  };

  const setItemPrimary = async () => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/fridge/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { primary: true }, id: state.id }),
    }).then(() =>
      setState((prevState) => ({ ...prevState, primary: true, changed: true }))
    );
  };

  const setItemElement = async (option, value, id) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/${token}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: { [option]: value }, id: id }),
    }).then(() => {
      const itemIndex = state.items.findIndex((element) => element._id == id);
      let newArray = [...state.items];
      newArray[itemIndex] = { ...newArray[itemIndex], [option]: value };
      setState((prevState) => ({
        ...prevState,
        items: newArray,
      }));
    });
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteItem = async (item) => {
    let token = await SecureStore.getItemAsync("user_token");
    await fetch(`http://localhost:3200/v1/item/fridge/${token}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fridge: state.id, items: [item] }),
    }).then(() => {
      const itemIndex = state.items.findIndex(
        (element) => element._id == item._id
      );
      let newArray = [...state.items];
      newArray.splice(itemIndex, 1);
      setState((prevState) => ({
        ...prevState,
        items: newArray,
      }));
    });
  };

  const formatDate = (date) => {
    date = new Date(date);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }
    if (day.length < 2) {
      day = "0" + day;
    }

    return [month, day, year].join("/");
  };

  const getExpirationColor = (date) => {
    if (!date) {
      return "#CBCBCB";
    }
    date = new Date(date);
    if (date < Date.now()) {
      return "red";
    } else {
      if ((date - Date.now()) / (1000 * 60 * 60 * 24) <= 3) {
        return "orange";
      } else {
        return "green";
      }
    }
  };

  const getItemType = (type) => {
    switch (type?.toLowerCase()) {
      case "meat":
        return "drumstick-bite";
      case "vegetable":
        return "carrot";
      case "fruit":
        return "apple-alt";
      case "fish":
        return "fish";
      default:
        return "question";
    }
  };

  const toggleModal = () => {
    setModal((prev) => ({
      ...prev,
      visible: !prev.visible,
    }));
  };

  const loadAddItem = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            height: "60%",
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              height: "18%",
              paddingTop: 20,
            }}
          >
            <Text style={{ paddingBottom: 10, fontSize: 16 }}>
              Name (required):
            </Text>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#CBCBCB",
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}
            >
              <TextInput
                style={{
                  fontSize: 16,
                }}
                numberOfLines={1}
                placeholder={"Name..."}
                onChangeText={(val) =>
                  setModal((prev) => ({
                    ...prev,
                    newValue: val,
                  }))
                }
              />
            </View>
          </View>
          <View
            style={{
              width: "90%",
              height: "20%",
              paddingVertical: 20,
            }}
          >
            <Text style={{ paddingBottom: 0, fontSize: 16 }}>Type:</Text>
            <View
              style={{
                borderRadius: 12,
                paddingHorizontal: 10,
              }}
            >
              <Picker
                selectedValue={modal.newType}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                itemStyle={{
                  height: "100%",
                }}
                onValueChange={(val) => {
                  if (val !== "0") {
                    setModal((prev) => ({
                      ...prev,
                      newType: val,
                    }));
                  }
                }}
              >
                <Picker.Item
                  label={"Scroll to a type..."}
                  value={"0"}
                  color={"#CBCBCB"}
                />
                <Picker.Item label={"Fish"} value={"fish"} />
                <Picker.Item label={"Fruit"} value={"fruit"} />
                <Picker.Item label={"Meat"} value={"meat"} />
                <Picker.Item label={"Vegetable"} value={"vegetable"} />
              </Picker>
            </View>
          </View>
          <View
            style={{
              width: "90%",
              height: "50%",
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Text style={{ paddingBottom: 0, fontSize: 16 }}>
                Expiration Date:
              </Text>
              <DateTimePicker
                testID="dateTimePicker"
                value={modal.newDate}
                mode={"date"}
                display={"default"}
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || modal.newDate;
                  setModal((prev) => ({
                    ...prev,
                    newDate: currentDate,
                  }));
                }}
                style={{
                  height: "95%",
                }}
              />
            </View>
          </View>

          <View
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#2D82FF",
                borderRadius: 16,
                width: "45%",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={toggleModal}
              >
                <Text style={{ fontSize: 16, color: "white" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: modal.newValue === "" ? "#A7CBFF" : "#2D82FF",
                borderRadius: 16,
                width: "45%",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  addItem({
                    name: modal.newValue,
                    type: modal.newType,
                    exp_date: modal.newDate,
                    bought_date: new Date(),
                  });
                  toggleModal();
                }}
                disabled={modal.newValue === ""}
              >
                <Text style={{ fontSize: 16, color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const loadModalByOption = (option, value) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            height:
              option === "exp_date" ? "35%" : option === "name" ? "15%" : "22%",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              width: "90%",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {option === "name" ? (
              <View
                style={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#CBCBCB",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                }}
              >
                <TextInput
                  style={{
                    fontSize: 16,
                  }}
                  numberOfLines={1}
                  placeholder={value.name}
                  onChangeText={(val) =>
                    setModal((prev) => ({
                      ...prev,
                      newValue: val,
                      changed: val === "" || val === value.name ? false : true,
                    }))
                  }
                />
              </View>
            ) : option === "type" ? (
              <View
                style={{
                  borderRadius: 12,
                  paddingHorizontal: 10,
                }}
              >
                <Picker
                  selectedValue={modal.newValue}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  itemStyle={{
                    height: "100%",
                  }}
                  onValueChange={(val) => {
                    if (val !== "0") {
                      setModal((prev) => ({
                        ...prev,
                        newValue: val,
                        changed: val === value.type ? false : true,
                      }));
                    }
                  }}
                >
                  <Picker.Item
                    label={"Scroll to a type..."}
                    value={"0"}
                    color={"#CBCBCB"}
                  />
                  <Picker.Item label={"Fish"} value={"fish"} />
                  <Picker.Item label={"Fruit"} value={"fruit"} />
                  <Picker.Item label={"Meat"} value={"meat"} />
                  <Picker.Item label={"Vegetable"} value={"vegetable"} />
                </Picker>
              </View>
            ) : (
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <DateTimePicker
                  testID="dateTimePicker"
                  value={
                    modal.changed
                      ? modal.newDate
                      : value.exp_date
                      ? new Date(value.exp_date)
                      : new Date()
                  }
                  mode={"date"}
                  display={"default"}
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || modal.newDate;
                    setModal((prev) => ({
                      ...prev,
                      newDate: currentDate,
                      changed:
                        formatDate(selectedDate) !== formatDate(value.exp_date),
                    }));
                  }}
                  style={{
                    height: "95%",
                  }}
                />
              </View>
            )}
          </View>
          <View
            style={{
              width: "80%",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#2D82FF",
                borderRadius: 16,
                width: "45%",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={toggleModal}
              >
                <Text style={{ fontSize: 16, color: "white" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: !modal.changed ? "#A7CBFF" : "#2D82FF",
                borderRadius: 16,
                width: "45%",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  option === "exp_date"
                    ? setItemElement(option, modal.newDate, value._id)
                    : setItemElement(option, modal.newValue, value._id);
                  toggleModal();
                }}
                disabled={!modal.changed}
              >
                <Text style={{ fontSize: 16, color: "white" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const loadConfirmation = (option) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            justifyContent: "center",
            width: "60%",
            height: 50,
          }}
        >
          <Text numberOfLines={1} style={{ textAlign: "center", fontSize: 16 }}>
            Are you sure?
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "flex-end",
            width: "60%",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "50%",
            }}
          >
            <TouchableOpacity
              style={{
                padding: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={toggleModal}
            >
              <Text style={{ fontSize: 16, color: "#2D82FF" }}>No</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#2D82FF",
              width: "50%",
            }}
          >
            <TouchableOpacity
              style={{
                padding: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                option === "delete" ? deleteFridge() : clearFridge();
                toggleModal();
              }}
            >
              <Text style={{ fontSize: 16, color: "white" }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View>
        <Modal isVisible={modal.visible}>
          {modal.style === "delete" || modal.style === "clear"
            ? loadConfirmation(modal.style)
            : modal.style === "add"
            ? loadAddItem()
            : loadModalByOption(modal.style, modal.value)}
        </Modal>
      </View>
      <View
        style={{
          flex: 1,
          paddingLeft: 10,
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            state.changed
              ? navigation.navigate("FridgeHub", { data: state.id })
              : navigation.navigate("FridgeHub")
          }
        >
          <FontAwesome5 name={"chevron-left"} size={22} color={"#2D82FF"} />
        </TouchableOpacity>
      </View>
      {/* --------------------------------Fridge Name / DefaultOrNot / DropDown Menu----------- */}
      <View
        style={{
          flex: 1.4,
          flexDirection: "row",
          paddingHorizontal: 25,
          paddingVertical: 8,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 3,
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: state.name.length > 8 ? 25 : 40,
              color: "#2D82FF",
            }}
          >
            {state.name}
          </Text>
          <View
            style={{
              paddingLeft: 10,
              justifyContent: "center",
            }}
          >
            {state.primary ? (
              <FontAwesome5 name={"igloo"} size={ state.name.length > 8 ? 26 : 36 } color={"black"} />
            ) : (
              <Text />
            )}
          </View>
        </View>

        <View
          style={{
            flex: 1.4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TouchableOpacity
            onPress={() => setItemPrimary()}
            disabled={state.primary}
          >
            <FontAwesome
              name={"star"}
              size={25}
              color={state.primary ? "#A7CBFF" : "#2D82FF"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                style: "delete",
              }))
            }
          >
            <FontAwesome5 name={"trash"} size={25} color={"#2D82FF"} />
          </TouchableOpacity>
        </View>
      </View>
      {/* --------------------------------List Options (Search, Clear List)-------------------- */}
      <View
        style={{
          flex: 1.6,
          flexDirection: "row",
          alignItems: "center",
          borderColor: "#CBCBCB",
          paddingHorizontal: 25,
          paddingBottom: 5,
        }}
      >
        <View
          style={{
            flex: 3,
            flexDirection: "row",
            paddingHorizontal: 10,
            paddingVertical: 10,
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#CBCBCB",
            borderRadius: 15,
          }}
        >
          <View
            style={{
              flex: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FontAwesome5
              style={{
                paddingRight: 10,
              }}
              name={"search"}
              size={15}
            />
            <TextInput
              style={{
                width: "90%",
                fontSize: 15,
              }}
              numberOfLines={1}
              placeholder={"search item..."}
              value={state.search}
              onChangeText={(text) =>
                setState((prevState) => ({ ...prevState, search: text.trim() }))
              }
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              disabled={state.search === ""}
              onPress={() =>
                setState((prevState) => ({
                  ...prevState,
                  search: "",
                }))
              }
            >
              <FontAwesome name={"times-circle"} size={16} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#2D82FF",
              borderRadius: 12,
              padding: 5,
              width: "80%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() =>
              setModal((prevState) => ({
                ...prevState,
                visible: true,
                style: "clear",
              }))
            }
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 12,
                color: "white",
              }}
            >
              Clear List
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* --------------------------------List Labels------------------------------------------ */}
      <View
        style={{
          flex: 0.8,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 25,
          borderColor: "#CBCBCB",
          borderBottomWidth: 0.5,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingRight: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const items = state.items;
              items.sort((a, b) =>
                a.name > b.name
                  ? state.filter.name
                    ? -1
                    : 1
                  : b.name > a.name
                  ? state.filter.name
                    ? 1
                    : -1
                  : 0
              );
              setState((prevState) => ({
                ...prevState,
                items: items,
                filter: {
                  name: !prevState.filter.name,
                },
              }));
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text
                style={{ fontSize: 14, paddingRight: 5, fontWeight: "500" }}
              >
                Name
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.2,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const items = state.items;
              items.sort((a, b) =>
                a.type > b.type
                  ? state.filter.type
                    ? -1
                    : 1
                  : b.type > a.type
                  ? state.filter.type
                    ? 1
                    : -1
                  : 0
              );
              setState((prevState) => ({
                ...prevState,
                items: items,
                filter: {
                  type: !prevState.filter.type,
                },
              }));
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500" }}>Type</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.1,
            alignItems: "center",
          }}
        ></View>
        <View
          style={{
            flex: 0.45,
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const items = state.items;
              items.sort((a, b) =>
                a.exp_date > b.exp_date
                  ? state.filter.exp_date
                    ? -1
                    : 1
                  : b.exp_date > a.exp_date
                  ? state.filter.exp_date
                    ? 1
                    : -1
                  : 0
              );
              setState((prevState) => ({
                ...prevState,
                items: items,
                filter: {
                  exp_date: !prevState.filter.exp_date,
                },
              }));
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500" }}>Expiration</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* --------------------------------Food List-------------------------------------------- */}
      <View
        style={{
          flex: 14,
        }}
      >
        <SwipeListView
          useFlatList={true}
          data={
            state.search === ""
              ? state.items
              : state.items.filter((item) =>
                  item.name.toLowerCase().includes(state.search.toLowerCase())
                )
          }
          renderItem={(data, rowMap) => (
            <View
              style={{
                borderColor: "#CBCBCB",
                borderBottomWidth: 1,
                borderTopWidth: data.index === 0 ? 0.5 : 0,
                backgroundColor: "white",
                width: Math.round(Dimensions.get("window").width),
                height: 60,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 25,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingRight: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setModal({
                        visible: true,
                        style: "name",
                        value: data.item,
                        newDate: new Date(),
                        newValue: "",
                        changed: false,
                      })
                    }
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 17,
                      }}
                    >
                      {data.item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 0.2,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setModal({
                        visible: true,
                        style: "type",
                        value: data.item,
                        newDate: new Date(),
                        newValue: data.item.type,
                        changed: false,
                      })
                    }
                  >
                    <FontAwesome5
                      name={getItemType(data.item.type)}
                      size={20}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 0.1,
                    alignItems: "center",
                  }}
                >
                  <FontAwesome
                    name={"circle"}
                    color={getExpirationColor(data.item.exp_date)}
                  />
                </View>
                <View
                  style={{
                    flex: 0.45,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setModal({
                        visible: true,
                        style: "exp_date",
                        value: data.item,
                        newDate: data.item.exp_date
                          ? new Date(data.item.exp_date)
                          : new Date(),
                        newValue: "",
                        changed: data.item.exp_date ? false : true,
                      })
                    }
                  >
                    {data.item.exp_date ? (
                      <Text numberOfLines={1}>
                        {formatDate(data.item.exp_date)}
                      </Text>
                    ) : (
                      <View style={{}}>
                        <FontAwesome name={"calendar-o"} size={24} />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingLeft: 15,
                borderBottomColor: "#CBCBCB",
                borderBottomWidth: 1,
                backgroundColor: "red",
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  bottom: 0,
                  justifyContent: "center",
                  position: "absolute",
                  top: 0,
                  width: 75,
                  backgroundColor: "red",
                  right: 0,
                }}
                onPress={() => {
                  closeRow(rowMap, data.index);
                  deleteItem(data.item);
                }}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-75}
          onRowOpen={(rowKey, rowMap) => {
            setTimeout(() => {
              closeRow(rowMap, rowKey);
            }, 2000);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {/* --------------------------------Add Item--------------------------------------------- */}
      <View
        style={{
          flex: 1.5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#2D82FF",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#2D82FF",
            height: "100%",
            width: "100%",
          }}
          onPress={() =>
            setModal((prevState) => ({
              ...prevState,
              visible: true,
              style: "add",
              newValue: "",
              newDate: new Date(),
              newType: "",
            }))
          }
        >
          <Text style={{ fontSize: 20, color: "white" }}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addFridgeEnabled: {
    borderWidth: 5,
    borderColor: "#0771ED",
    borderRadius: 50,
    width: "30%",
    height: "80%",
    backgroundColor: "#2D82FF",
    justifyContent: "center",
    alignItems: "center",
  },
  addFridgeDisabled: {
    borderWidth: 5,
    borderColor: "#7DADE5",
    borderRadius: 50,
    width: "30%",
    height: "80%",
    backgroundColor: "#85B2E6",
    justifyContent: "center",
    alignItems: "center",
  },
});
