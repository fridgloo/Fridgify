import React, {useEffect, useRef} from "react";
import {View, StyleSheet } from "react-native";
import Styles from '../constants/Styles';
import LottieView from 'lottie-react-native';

function LoadingAnimation(props) {
   const animation = useRef(null);

   useEffect(() => {
      animation.current.play();
      // Or set a specific startFrame and endFrame with:  
      // this.animation.play(30, 120);
   });  

//  resetAnimation = () => {
//    this.animation.reset();
//    this.animation.play();
//  };

   return (
      <View style={styles.container} >
         <LottieView
            ref={animation}
            style={{
               width: 400,
               height: 400,
               position: 'absolute',
               backgroundColor: '#808080'
            }}
            source={require('../assets/animations/lf30_editor_1ByF2l.json')}
            />              
      </View>
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
     backgroundColor: '#808080',
     opacity: 0.7,
  },
  text: {
     color: 'black',
     fontSize: 20,
     margin: 30,
     fontFamily: Styles.text.fontFamily
  }
});
  

export default LoadingAnimation;