import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Image, FlatList } from 'react-native';
import IconButton from '../../components/IconButton';
import * as ImagePicker from 'expo-image-picker';
import PhotoSquare from '../../components/PhotoSquare';
import { newUserVar } from '../../client';

export interface ImageUploadScreenProps {
  navigation: any;
  route: any;
}
 
const ImageUploadScreen: React.FC<ImageUploadScreenProps> = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState<string>();
  const [images, setImages] = useState<string[]>([])

  const handleUpload = (image: string) => {
    setImages([...images, image]);   
  }

  const handleDelete = (imageToDelete: string) => {
    setImages(images.filter((image) => image !== imageToDelete));    
  }

  const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    })
    if (!result.cancelled) {      
      setProfileImage(result.uri);      
    }
  };

  return ( 
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={takeImage}>
        {!profileImage && <IconButton name={'camera'} color={'white'} bgColor={'#99879D'} size={30}/>}
        {profileImage && <Image source={{uri: profileImage}} style={styles.thumbnail}/>}
      </TouchableOpacity>
      <Text style={styles.text}>Upload images and videos of places you'd like to show us!</Text>
      <View style={{flexDirection:'row', flexWrap:'wrap', alignItems: 'center',  justifyContent: 'center'}}>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
        <PhotoSquare handleUpload={handleUpload} handleDelete={handleDelete}/>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          newUserVar({...newUserVar(), profileImg: 'https://picsum.photos/200' ? 'https://picsum.photos/200' : '', 
            // photoAlbum: ['https://picsum.photos/200', 'https://picsum.photos/200', 'https://picsum.photos/200']
          });
          navigation.navigate('SummaryScreen');
      }}>
        <IconButton name={'chevron-right'} color={'white'} size={30} bgColor={'#99879D'}/>
      </TouchableOpacity>
    </View>
   );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    width: '15%',
    height: '7%',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  tagView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'center',
  },
})
 
export default ImageUploadScreen;