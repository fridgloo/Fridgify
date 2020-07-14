import React from "react";
import {Image, ScrollView, Text, View, SafeAreaView, TouchableOpacity, StyleSheet} from "react-native";
import Styles from '../constants/Styles';
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function RecipeDetailsScreen (props) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.pictureContainer}>
          <Image
            style={styles.picture}
            resizeMode='contain'
            source={require('../assets/images/arm.jpg')} //igloo25Bot.png
          />
        </View>
        
        <View style={styles.scrollviewContainer}>
          <ScrollView style={styles.scrollview}>
              <Text style={styles.descTitle}>Ingredients:</Text>
              <Text style={styles.desc}> Will </Text>
  
              <Text style={styles.descTitle}> Directions:</Text>
              <Text style={styles.desc}> Just take Will and have his arm </Text>
  
              <Text style={styles.descTitle}> Random Text:</Text>
              <Text style={styles.desc}>Dissuade ecstatic and properly saw entirely sir why laughter endeavor. In on my jointure horrible margaret suitable he followed speedily. Indeed vanity excuse or mr lovers of on. By offer scale an stuff. Blush be sorry no sight. Sang lose of hour then he left find. 
                                        Him rendered may attended concerns jennings reserved now. Sympathize did now preference unpleasing mrs few. Mrs for hour game room want are fond dare. For detract charmed add talking age. Shy resolution instrument unreserved man few. She did open find pain some out. If we landlord stanhill mr whatever pleasure supplied concerns so. Exquisite by it admitting cordially september newspaper an. Acceptance middletons am it favourable. It it oh happen lovers afraid. 
                                        Greatly hearted has who believe. 
              </Text>
          </ScrollView>
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
    scrollviewContainer: {
      width: '100%',
      height: '60%',
      top: 100,
      //borderWidth: 2,
      //borderColor: 'black',
    },
    scrollview: {
      position: 'absolute',
      paddingLeft: 10,
      paddingRight: 10,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    descTitle: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      paddingTop: '10%',
      fontWeight: 'bold'
    },
    
    desc: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      paddingTop: '2%'
    },
    pictureContainer: {
      position: 'absolute',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center', 
      top: 25,
      width: '100%',
      height: '35%',
       //borderWidth: 2,
      // borderColor: 'black',
    },
  
    picture: {
       //borderWidth: 2,
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
  
  });
  
  
  