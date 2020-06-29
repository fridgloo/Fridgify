import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
//import * as SecureStore from "expo-secure-store";
import Icon from "react-native-vector-icons/FontAwesome";

// import fridgesApi from "../api/fridges";
// import useApi from "../hooks/useApi";

export default function FridgeHubScreen() {
  return <Text>FridgeHub</Text>;
}

// export default function FridgeHubScreen({ navigation, route }) {
//   const getFridgesApi = useApi(fridgesApi.getFridges);

//   const [modal, setModal] = React.useState({
//     visible: false,
//     newName: "",
//   });

//   useEffect(() => {
//     getFridgesApi.request();
//     console.log(getFridgesApi.data);
//   }, []);

//   const toggleModal = () => {
//     setModal((prev) => ({
//       ...prev,
//       visible: !prev.visible,
//     }));
//   };

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: "white",
//       }}
//     >
//       <View>
//         <Modal isVisible={modal.visible}>
//           <View
//             style={{
//               flex: 1,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <View
//               style={{
//                 width: "80%",
//                 height: "15%",
//                 backgroundColor: "white",
//                 alignItems: "center",
//                 justifyContent: "space-evenly",
//                 borderRadius: 12,
//               }}
//             >
//               <View
//                 style={{
//                   width: "85%",
//                   height: "90%",
//                   flex: 1,
//                   justifyContent: "center",
//                 }}
//               >
//                 <View
//                   style={{
//                     borderRadius: 12,
//                     borderWidth: 1,
//                     borderColor: "#CBCBCB",
//                     paddingHorizontal: 15,
//                     paddingVertical: 15,
//                   }}
//                 >
//                   <TextInput
//                     style={{
//                       fontSize: 16,
//                     }}
//                     numberOfLines={1}
//                     placeholder={"Fridge name..."}
//                     onChangeText={(val) =>
//                       setModal((prevState) => ({
//                         ...prevState,
//                         newName: val,
//                       }))
//                     }
//                   />
//                 </View>
//               </View>
//               <View
//                 style={{
//                   flex: 0.5,
//                   width: "100%",
//                   height: "100%",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   borderTopColor: "#CBCBCB",
//                   borderTopWidth: 1,
//                 }}
//               >
//                 <View
//                   style={{
//                     backgroundColor: "white",
//                     width: "50%",
//                     justifyContent: "center",
//                     borderBottomStartRadius: 12,
//                   }}
//                 >
//                   <TouchableOpacity
//                     style={{
//                       padding: 5,
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                     onPress={toggleModal}
//                   >
//                     <Text style={{ fontSize: 16, color: "#2D82FF" }}>
//                       Cancel
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//                 <View
//                   style={{
//                     backgroundColor:
//                       modal.newName === "" ? "#A7CBFF" : "#2D82FF",
//                     width: "50%",
//                     justifyContent: "center",
//                     borderBottomEndRadius: 12,
//                   }}
//                 >
//                   <TouchableOpacity
//                     style={{
//                       padding: 5,
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                     onPress={() => {
//                       fridgesApi.addFridge(modal.newName);
//                       toggleModal();
//                     }}
//                     disabled={modal.newName === ""}
//                   >
//                     <Text style={{ fontSize: 16, color: "white" }}>Create</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//       {/* --------------------------------Header ---------------------------------------------- */}
//       <View
//         style={{
//           flex: 1,
//           paddingHorizontal: 25,
//           paddingVertical: 5,
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <Image
//           style={{
//             height: 60,
//             width: 60,
//           }}
//           resizeMode="center"
//           source={require("../assets/images/igloo25.png")}
//         />

//         <Text
//           adjustsFontSizeToFit
//           style={{
//             paddingLeft: 15,
//             color: "#2D82FF",
//             fontSize: 32,
//             fontWeight: "600",
//             fontFamily: "System",
//           }}
//         >
//           Fridgloo
//         </Text>
//       </View>
//       {/* --------------------------------Expiration Overview --------------------------------- */}
//       <View
//         style={{
//           flex: 2,
//           paddingHorizontal: 25,
//           paddingTop: 15,
//         }}
//       >
//         <View>
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: "600",
//             }}
//           >
//             Expiration Overview
//           </Text>
//         </View>
//         <View
//           style={{
//             alignItems: "center",
//             paddingVertical: 20,
//           }}
//         >
//           <TouchableOpacity
//             style={{
//               borderRadius: 20,
//               width: Math.round(Dimensions.get("window").width - 50),
//               height: "100%",
//               backgroundColor: "#F1F3F6",
//             }}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 flexDirection: "row",
//               }}
//             >
//               <View
//                 style={{
//                   flex: 1,
//                   justifyContent: "center",
//                   paddingLeft: 25,
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontWeight: "600",
//                     fontSize: 25,
//                     paddingBottom: 20,
//                   }}
//                 >
//                   1 day left
//                 </Text>
//                 <Text
//                   style={{
//                     fontWeight: "300",
//                     fontSize: 15,
//                     paddingBottom: 10,
//                   }}
//                 >
//                   Your yogurt is expiring
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   flex: 1,
//                   flexDirection: "row",
//                   justifyContent: "flex-end",
//                   alignItems: "center",
//                   paddingRight: 10,
//                 }}
//               >
//                 <View
//                   style={{
//                     borderRadius: 40,
//                     width: 50,
//                     height: 50,
//                     backgroundColor: "#FF7F23",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Icon name={"exclamation"} size={25} color="white"></Icon>
//                 </View>
//                 <View
//                   style={{
//                     paddingLeft: 10,
//                   }}
//                 >
//                   <Icon name={"chevron-right"} size={25} color="black"></Icon>
//                 </View>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>
//       {/* --------------------------------Fridges---------------------------------------------- */}
//       <View
//         style={{
//           flex: 2.5,
//           paddingLeft: 25,
//           paddingTop: 25,
//         }}
//       >
//         <View>
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: "600",
//             }}
//           >
//             Your Fridges
//           </Text>
//         </View>

//         <View
//           style={{
//             flex: 1,
//             flexDirection: "row",
//             justifyContent: "center",
//             alignItems: "center",
//             paddingVertical: 10,
//             paddingLeft: 10,
//           }}
//         >
//           <TouchableOpacity
//             style={
//               getFridgesApi.data.length >= 4
//                 ? styles.addFridgeDisabled
//                 : styles.addFridgeEnabled
//             }
//             onPress={toggleModal}
//             disabled={getFridgesApi.data.length >= 4}
//           >
//             <Icon name={"plus"} size={25} color="white"></Icon>
//           </TouchableOpacity>
//           <ScrollView horizontal style={{ height: "100%" }}>
//             {getFridgesApi.data?.map((fridge, index) => {
//               return (
//                 <TouchableOpacity
//                   style={{
//                     backgroundColor: "#F1F3F6",
//                     // borderWidth: 1,
//                     // borderColor: "gray",
//                     borderRadius: 20,
//                     width: Math.round(Dimensions.get("window").width / 3.8),
//                     height: "100%",
//                     marginLeft: 10,
//                   }}
//                   key={index}
//                   onPress={() =>
//                     navigation.navigate("FridgeScreen", {
//                       data: fridge,
//                       type: "INITIALIZE",
//                     })
//                   }
//                 >
//                   <View
//                     style={{
//                       paddingHorizontal: 8,
//                       paddingTop: 25,
//                       paddingBottom: 10,
//                       justifyContent: "center",
//                       alignItems: "center",
//                     }}
//                   >
//                     <Text
//                       style={{
//                         textAlign: "center",
//                       }}
//                     >
//                       {fridge.name}
//                     </Text>
//                   </View>

//                   <View
//                     style={{
//                       alignItems: "flex-end",
//                       justifyContent: "center",
//                       paddingRight: 10,
//                     }}
//                   >
//                     <View
//                       style={{
//                         width: "10%",
//                         height: "42%",
//                         backgroundColor: "#C4C4C4",
//                       }}
//                     ></View>
//                   </View>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>
//       </View>
//       {/* --------------------------------Recipe of the Day------------------------------------ */}
//       <View
//         style={{
//           flex: 2.5,
//           paddingTop: 25,
//           paddingBottom: 50,
//         }}
//       >
//         <View
//           style={{
//             paddingLeft: 25,
//             paddingBottom: 10,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 16,
//               fontWeight: "600",
//             }}
//           >
//             Recipe of the Day
//           </Text>
//         </View>
//         <View>
//           <ImageBackground
//             style={{
//               width: "100%",
//               height: "100%",
//               resizeMode: "cover",
//               justifyContent: "center",
//             }}
//             source={require("../assets/images/some-salad-small.jpg")}
//           >
//             <View
//               style={{
//                 paddingLeft: 20,
//                 width: "40%",
//               }}
//             >
//               <View
//                 style={{
//                   backgroundColor: "white",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   borderRadius: 10,
//                 }}
//               >
//                 <Text style={{ fontWeight: "bold" }}>SALAD</Text>
//                 <Text style={{ fontWeight: "200" }}>A Plantful Dish</Text>
//               </View>
//             </View>
//           </ImageBackground>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   addFridgeEnabled: {
//     borderRadius: 50,
//     width: 60,
//     height: 60,
//     backgroundColor: "#FF7F23",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addFridgeDisabled: {
//     borderRadius: 50,
//     width: 60,
//     height: 60,
//     backgroundColor: "#FFC194",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
