import React, {useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import AuthButton from "../components/AuthButton";
import LogoText from "../components/LogoText";
import ProfileInfo from "../components/ProfileInfo";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "../providers/AuthContextProvider";

export default function ProfileScreen( { navigation, route }) {
  
    let nameArray = [];
    const {signOut} = useContext(AuthContext);
    const [state, setState] = useState({
      userName: "",
      password: "",
      email: "",
      fridgeNames: [],
      names: "",
    });

    useEffect(() => {
      getData();
    }, [])

    const getData = async () => {
        let token = await SecureStore.getItemAsync("user_token");
        //console.log(token);
        const response = await fetch(
            `http://localhost:3200/v1/user/Testing137`,{ //hardcoded for now
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
        const response2 = await fetch(
            `http://localhost:3200/v1/fridge/${token}`,{ 
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
          if (response.ok && response2.ok) {
            const data = await response.json();
            const data2 = await response2.json();
            console.log(data);
            console.log(data2);
            setState((prev) => ({
                userName: data.username,
                password: data.password,
                email: data.email,
                fridgeNames: data2.fridges,
              }));
            data2.fridges.forEach(fridge => {
              nameArray.push(fridge.name);
            })
            setState((prev) => ({
              ...prev,
              names: nameArray.join(', ')
            }));
          }
        }
    return (
    <SafeAreaView>
        <LogoText style={styles.profiletitle}>{state.userName}</LogoText>
        <ProfileInfo>Your Fridges: {state.names}</ProfileInfo>
        <ProfileInfo>Password: {state.password}</ProfileInfo>
        <ProfileInfo>Email: {state.email}</ProfileInfo>
        <AuthButton title="Dark Mode" onPress={() => console.log("Dark Mode was pressed")} />
        <AuthButton title="Turn Off Notification" onPress={() => console.log("Turn Off Notification was pressed")} />
        <AuthButton title="Log Out" onPress={() => {signOut()}} />
        {/* <AuthButton title="Route" onPress={() => console.log(route)} />
        <AuthButton title="Fridges" onPress={() => getData()}/> */}
    </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    profiletitle: {
      fontSize: 35,
      textAlign: "center",
      padding: "10%",
    },
  });

      // async function fetchAllData() {
    //   //console.log('fetchURLs');
    //   try {
    //     // Promise.all() lets us coalesce multiple promises into a single super-promise
    //     var data = await Promise.all([
    //       fetch(
    //         `http://localhost:3200/v1/user/Testing137`,{ //hardcoded for now
    //           method: "GET",
    //           headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //           },
    //         }
    //       ).then((response) => response.json()),// parse each response as text
    //       fetch(
    //         `http://localhost:3200/v1/fridge/id/5eeb8f0eea2f0316877cc74e`,{ //hardcoded for now
    //         method: "GET",
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     ).then((response) => response.json()),
    //     ]);
    
    //     //FOR DEBUG
    //     // for (var i of data) {
    //     //   console.log(`RESPONSE ITEM \n`);
    //     //   for (var obj of i) {
    //     //     console.log(obj);
    //     //     //logger utility method, logs output to screen
    //     //     console.log(obj);
    //     //   }
    //     // }
    
    //     return data;
    
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
