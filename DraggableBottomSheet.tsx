import { Dimensions, StyleSheet,Platform, Text, View, Animated, PanResponder } from 'react-native'
import React, { useRef } from 'react'
const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} =
  Dimensions.get('window');

const BOTTOM_SHEET_MAX_HEIGHT = WINDOW_HEIGHT *0.6
const BOTTOM_SHEET_MIN_HEIGHT = WINDOW_HEIGHT *0.1
const MAX_UPWARD_TRANSLATE_Y = BOTTOM_SHEET_MIN_HEIGHT-BOTTOM_SHEET_MAX_HEIGHT
const MAX_DOWNWARD_TRANSLATE_Y = 0
const DRAG_THRESHOLD = 50

const DraggableBottomSheet = () => {
  const animatedValue = useRef(new Animated.Value(0)).current
  const lastGestureDy = useRef(0)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder:()=>true,
      onPanResponderGrant:()=>{
        console.log("grant:",lastGestureDy.current);
        animatedValue.setOffset(lastGestureDy.current)
      },
      onPanResponderMove:(e,gesture)=>{
        console.log("move:",lastGestureDy.current);
        animatedValue.setValue(gesture.dy)
      },
      onPanResponderRelease:(e,gesture)=>{
        console.log("release:",lastGestureDy.current);
        animatedValue.flattenOffset()
        lastGestureDy.current += gesture.dy

          // dragging down  
          // if (lastGestureDy.current < MAX_UPWARD_TRANSLATE_Y) {
          //   lastGestureDy.current = MAX_UPWARD_TRANSLATE_Y
          // } else if(lastGestureDy.current>MAX_DOWNWARD_TRANSLATE_Y){
          //   lastGestureDy.current = MAX_DOWNWARD_TRANSLATE_Y
          // }
        if (gesture.dy > 0) {
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation('up')
          }else{
            springAnimation('down')
          }
        }else{
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation('down')
          }else{
            springAnimation('up')
          }
        }
      },
  }),
  ).current
  const springAnimation = (direction: 'up' | 'down') =>{
    lastGestureDy.current = direction === 'down' ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y
    Animated.spring(animatedValue,{
      toValue: lastGestureDy.current,
      useNativeDriver:true
    }).start()
  }
  const bottomSheetAnimation = {
    transform:[
      {translateY:animatedValue.interpolate({
        inputRange:[MAX_UPWARD_TRANSLATE_Y,MAX_DOWNWARD_TRANSLATE_Y],
        outputRange:[MAX_UPWARD_TRANSLATE_Y,MAX_DOWNWARD_TRANSLATE_Y],
        extrapolate: 'clamp',
      })}
    ]
  }

  return (
    <View style={styles.container}>
    <Animated.View style={[styles.bottomSheet,bottomSheetAnimation]}>
     <View style={styles.draggableArea} {...panResponder.panHandlers}>
     <View style={styles.dragHandle}/>
     </View>
    </Animated.View>
    </View>
  )
}

export default DraggableBottomSheet

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  bottomSheet:{
    position:"absolute",
    width:"100%",
    height:BOTTOM_SHEET_MAX_HEIGHT, 
    bottom: BOTTOM_SHEET_MIN_HEIGHT -BOTTOM_SHEET_MAX_HEIGHT,
    ...Platform.select({
      android: {elevation: 3},
      ios: {  
        shadowColor: '#a8bed2',
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: {
          width: 2,
          height: 2,
        },
      },
    }),
    backgroundColor:"white",
    borderTopLeftRadius:32,
    borderTopRightRadius:32
  },
  dragHandle:{
    width:100,
    height:5,
    backgroundColor:"#d3d3d3",
    borderRadius:10,
   
  },
  draggableArea: {
    width: 132,
    height: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
})