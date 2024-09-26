import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"
import Profile from './Profile';

export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1)

const CarouselCardItem = ({ item, index }: any) => {
  return (
    <View style={styles.container} key={index}>
      <Profile user={item.user} ownProfile={item.OwnProfile} />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    alignItems: 'center',
  },
})

export default CarouselCardItem;