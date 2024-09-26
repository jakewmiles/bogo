import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Platform, Image} from 'react-native';
import IconButton from './IconButton';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface PhotoSquareProps {
  handleUpload: any;
  handleDelete: any;
}
 
const PhotoSquare: React.FC<PhotoSquareProps> = ({ handleUpload, handleDelete }) => {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const cameraRollStatus = (await ImagePicker.requestMediaLibraryPermissionsAsync()).status;
        const cameraStatus = (await ImagePicker.requestCameraPermissionsAsync()).status;
        if (cameraRollStatus !== 'granted') {
          alert('Camera roll permission not given!');
        }
        if (cameraStatus !== 'granted') {
          alert('Camera permission not given!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    })
    if (!result.cancelled) {
      setImage(result.uri);
      handleUpload(result.uri);
    }
  };

  return ( 
    <View>
      {!image && <TouchableOpacity 
        style={styles.box}
        onPress={pickImage}
      >
        <IconButton name='plus-circle-outline' color='#99879D75' bgColor='transparent' size={40}/>
      </TouchableOpacity>}
      {image && <TouchableOpacity
                  onLongPress={() => {
                    handleDelete(image)
                    setImage(null)
                }}>  
        <Image source={{uri: image}} style={styles.thumbnail}/>
      </TouchableOpacity>}
    </View>
   );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#99879D75',
    borderStyle: 'dotted',
    borderRadius: 5,
    height: 125,
    width: 125,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1,
  },
  thumbnail: {
    height: 125,
    width: 125,
    margin: 1,
    borderWidth: 1,
    borderColor: '#99879D75',
  }
})
 
export default PhotoSquare;