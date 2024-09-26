import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import IconButton from '../components/IconButton';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';
import FloatingCard from '../components/FloatingCard';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';

export interface MapProps {
  title: string;
  currentLocation: boolean;
  onSelectLocation: any;
}

const Map: React.FC<MapProps> = ({ title, currentLocation, onSelectLocation }) => {
  const [region, setRegion] = useState<LocationObject>({ coords: { latitude: 0, longitude: 0, altitude: null, accuracy: null, altitudeAccuracy: null, heading: null, speed: null }, timestamp: 0 });
  const [marker, setMarker] = useState<LatLng>({ latitude: 0, longitude: 0 });
  const [location, setLocation] = useState('');
  const [disabledButton, setDisabledButton] = useState<boolean>(true);
  let _mapView: MapView;

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') console.log('Permission denied');
    let location = await Location.getCurrentPositionAsync({});
    setDisabledButton(false);
    setRegion(location)
  }

  const setLocationName = async (latitude: string, longitude: string) => {
    if (Number(latitude) > 0) {
      latitude = '+' + String(latitude);
    } else {
      latitude = String(latitude);
    };
    if (Number(longitude) > 0) {
      longitude = '+' + String(longitude)
    } else {
      longitude = String(longitude);
    };
    const response = await fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=5&offset=0&location=${encodeURIComponent(latitude)}${encodeURIComponent(longitude)}&radius=50&sort=-population`)
    const locations = await response.json();
    const cities = locations.data.filter((location: any) => location.type === "CITY");
    if (!cities.length) setLocation('No major cities nearby');
    else {
      setLocation(`${cities[0].city}, ${cities[0].country}`)
      onSelectLocation(cities[0].city, cities[0].country)
    };
  }

  return (
    <FloatingCard cardWidth={'75%'}>
      <Text style={styles.text}>{title}</Text>
      <MapView
        ref={(map: MapView) => { _mapView = map; }}
        style={styles.map}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: 51.5,
          longitude: 0.1,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        onLongPress={async (e) => {
          setMarker(e.nativeEvent.coordinate)
          let latitude = String(e.nativeEvent.coordinate.latitude);
          let longitude = String(e.nativeEvent.coordinate.longitude);
          setLocationName(latitude, longitude);
        }}
      >
        <Marker coordinate={marker} />
      </MapView>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.text, { width: '100%', paddingVertical: 5, paddingLeft: '20%' }]}>{location}</Text>
        {currentLocation && (
          <TouchableOpacity style={{ position: 'absolute', top: '-135%', right: '3%' }}
            onPress={() => {
              _mapView.animateToRegion({
                latitude: region.coords.latitude,
                longitude: region.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              })
              setMarker({ latitude: region.coords.latitude, longitude: region.coords.longitude })
              setLocationName(String(region.coords.latitude), String(region.coords.longitude));
            }}
            disabled={disabledButton}>
            <IconButton name={'crosshairs-gps'} color={'black'} size={30} bgColor={'white'} />
          </TouchableOpacity>
        )}
      </View>
    </FloatingCard>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  map: {
    width: Dimensions.get('window').width - 100,
    height: Dimensions.get('window').height - 400,
    borderWidth: 1,
  },
})

export default Map;