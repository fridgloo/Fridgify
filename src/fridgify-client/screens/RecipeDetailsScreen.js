import React, {useState} from "react";
import {Image, FlatList, Text, View, SafeAreaView, TouchableOpacity, StyleSheet} from "react-native";
import Styles from '../constants/Styles';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { MarkdownView } from 'react-native-markdown-view'
import HTML from 'react-native-render-html';

export default function RecipeDetailsScreen (props) {
  //From Daniel's data outline
    const [recipe, setRecipe] = useState([
      {
          "_id": "5f02b1ffc14216acdc765328",
          "name": "test4",
          "created": "2020-07-06T05:09:19.742Z",
          "instructions": "<p> Cook this </p><p> Cook that </p><p> Cook this </p><p> Cook that </p><p> Cook this </p><p> Cook that </p><p> Cook this </p><p> Cook that </p><p> Cook this </p><p> Cook that </p><p> Cook this </p><p> Cook that </p>",
          "cuisine": "test cuisine",
          "items": [
              {
                  "recipe_item_idx_id": "5f02b1ffc14216acdc76532a",
                  "item_name": "broccoli01",
                  "quantity_val": 1,
                  "quantity": "lb"
              },
              {
                  "recipe_item_idx_id": "5f02b1ffc14216acdc76532c",
                  "item_name": "carrot01",
                  "quantity_val": 2,
                  "quantity": "kg"
              },
              {
                  "recipe_item_idx_id": "5f02b1ffc14216acdc76532e",
                  "item_name": "potato10",
                  "quantity_val": 3,
                  "quantity": "g"
              }
          ]
      }
  ]);
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pictureContainer}>
          <Image
              style={styles.picture}
              resizeMode='contain'
              source={require('../assets/images/arm.jpg')}
            />
        </View>

        <View style={{position: 'absolute', top: '8%', left: '2.5%'}}>
          <TouchableOpacity>
            <FontAwesome5 name={"chevron-left"} size={22} color={"#2D82FF"} />
          </TouchableOpacity>
        </View>

        <View style={styles.webviewContainer}>         
          <FlatList 
            style={styles.flatlist}
            data={recipe}
            renderItem={({item}) => (
              <View>
                <Text style={styles.descTitle}> Ingredients:</Text>
                <MarkdownView style={styles.desc}>
                  {item.items.map(ingredient => {
                      return '\u2022 ' + ingredient.quantity_val + ' ' + ingredient.quantity +  ' ' + ingredient.item_name + '\n';
                  })}
                </MarkdownView>
                <Text style={styles.descTitle}>Instructions: </Text>
                <HTML
                  tagsStyles={{p: {fontFamily: 'Avenir', paddingTop: '2%', paddingLeft: '8%', paddingRight: '8%', fontSize: 15}}} 
                  html={item.instructions} />
              </View>
            )}
            />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Will's Arm</Text>
          <View style={styles.estimate}>
            <Text>Estimated Time 10 mins</Text>
          </View>
        </View>
        
  
        <TouchableOpacity style={styles.addGlistEnabled}>
          <FontAwesome
            name={"star"}
            size={25}
            color={true ? "yellow" : "white"} //hardcoded for now
          />
        </TouchableOpacity>
      </SafeAreaView>
    
    );
  }
  
  const styles = StyleSheet.create ({
    container: { 
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center', 
       position: 'absolute',
       top: 0,
       bottom: 0,
       left: 0,
       right: 0,
       backgroundColor: 'white',
       opacity: 0.7,
    },
    webviewContainer: {
      width: '100%',
      height: '60%',
      top: 100,
      // borderWidth: 2,
      // borderColor: 'red',
    },
    flatlist: {
      position: 'absolute',
      paddingLeft: 10,
      paddingRight: 10,
      bottom: 0,
      width: '100%',
      height: '100%',
      borderWidth: 2,
      borderColor: 'red',
    },
    descTitle: {
      fontFamily: 'Avenir',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      paddingTop: '15%',
      paddingLeft: '4%',
      fontWeight: 'bold',
      // borderWidth: 2,
      // borderColor: 'blue',
    },
    
    desc: {
      fontFamily: 'Avenir',
      fontStyle: 'normal',
      fontWeight: 'normal',
      paddingLeft: '8%',
      fontSize: 15,
      

    },

    pictureContainer: {
      position: 'absolute',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center', 
      top: 25,
      width: '100%',
      height: '35%',
      //  borderWidth: 2,
      // borderColor: 'black',
    },
  
    picture: {
      // borderWidth: 2,
      // borderColor: 'red',
      height: '100%',  
      flex:1,
      width: '100%',
    },
  
    text: {
       color: 'black',
       fontSize: 20, //needs to be responsive 
       margin: 30,
       fontFamily: Styles.text.fontFamily,
    },
    titleContainer: {
       position: 'absolute',
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center', 
       width: '60%',
       height: '8%',
       top: '35%',
       backgroundColor: '#2D82FF',
       borderRadius: 15,
    },
    title: {
      position: 'absolute',
      color: 'white',
      fontWeight: 'bold',
      fontSize: 30,
      fontFamily: Styles.text.fontFamily,
      top: 5,
  
    },
  
    estimate: {
      position: 'absolute',
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      lineHeight: 25,/* identical to box height, or 28px */
      width: '100%',
      letterSpacing: 1,
      backgroundColor: 'white',
      borderRadius: 15,
      //padding: 10,
      bottom: -10,
      alignItems: 'center',
      shadowOffset: {width:0, height:5},
      shadowColor: 'black',
      shadowOpacity: .4,
    },
    favorites: {
        position: 'absolute',
        backgroundColor: "green",
        alignItems: "center",
        justifyContent: "center",
        bottom: 0,
        height: "10%",
        width: "10%",
        borderRadius: 30
    },
  
    addGlistEnabled: {
      position: 'absolute',
      borderRadius: 30,
      width: 50,
      height: 50,
      bottom: 10,
      backgroundColor: "#2D82FF",
      justifyContent: "center",
      alignItems: "center",
    },
    // webview: {
    //   borderWidth: 2,
    //   borderColor: 'red',
    //   height: '100%',
    //   width: '100%',
    //   position: 'relative',
    //   flex: 0,
    //   resizeMode: 'cover',

    scrollview: {
      // borderWidth: 2,
      // borderColor: 'red',
      height: '100%',
      width: '100%',
      position: 'relative',
      flex: 0,
      resizeMode: 'cover',
      
    },
  
  });
  
  
  