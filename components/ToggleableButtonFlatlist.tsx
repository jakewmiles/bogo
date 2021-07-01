import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, View } from 'react-native';
import TextButton from '../components/TextButton';

export interface ToggleableButtonFlatlistProps {
  array: any;
}

const ToggleableButtonFlatlist: React.FC<ToggleableButtonFlatlistProps> = ({ array }) => {
  const [renderData, setRenderData] = useState(array)

  const onPressHandler = (id: string) => {
    let copyData = [...renderData]
    for (let data of copyData){
      if (data.id === id) {
        data.selected = !data.selected;
      }
    }
    setRenderData(copyData)
  }

  return (
    <View style={{height: 500, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 }}>
      <FlatList
        data={renderData}
        columnWrapperStyle={styles.tagView}
        numColumns={5}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity 
            onPress={() => onPressHandler(item.id)}
            style={{height: 48, marginHorizontal: 2, marginVertical: 2}}
          >
            <TextButton title={item.name} filled={item.selected}/>
          </TouchableOpacity>
        )}
        extraData={renderData}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  tagView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'center',
  },
  
})

export default ToggleableButtonFlatlist;