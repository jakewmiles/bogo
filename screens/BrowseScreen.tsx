import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from '../components/ProfileCarousel';
import { useNavigation } from '@react-navigation/core';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainBottomTabParamList } from '../types';
import { gql, useQuery } from '@apollo/client';
import { userVar, filterInterestsVar, filterFavoritesVar } from '../client';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Cormorant_600SemiBold } from '@expo-google-fonts/dev';

interface Props {
  navigation: any;
  route: any;
}

const GET_USERS = gql`
  query getUsers($users: UsersInput!) {
    users(input: $users) {
      id
      firstName
      lastName
      guide
      city
      country
      gender
      summary
      profileImg
      filterCity
      languages {
        id
        name
      }
      interests {
        id
        name
      }
      isFavorited
    }
  }
`;

const BrowseScreen = (props: Props) => {
  const [index, setIndex] = React.useState<Number>(0)
  const isCarousel = React.useRef(null);

  const userInfo = userVar().user;

  console.log('city', userInfo.filterCity);
  console.log('activeUserId', userInfo.id);

  const { loading, error, data: users } = useQuery(GET_USERS, {
    variables: {
      users: { city: userInfo.filterCity, activeUserId: userInfo.id }
    }
  });
  while (loading) {
    return null;
  }

  let data: any[] = [];

  console.log('hello user', users);

  // add each user pulled from server to the data array
  if (users) {
    users.users.forEach((user: any) => {
      data.push({ user: user, ownProfile: false })
    });
  }

  //remove the users who to not have a matching interest per the interest filter if there is an interest filter
  const filterInterests = filterInterestsVar().selectedInterests;
  if (filterInterests && filterInterests.length > 0) {
    data = data.filter(userObject => {
      const interests = userObject.user.interests;
      for (let i = 0; i < filterInterests.length; i++) {
        for (let j = 0; j < interests.length; j++) {
          if (filterInterests[i].id === interests[j].id) return true;
        }
      }
      return false;
    })
  }

  if (filterFavoritesVar()) {
    data = data.filter(userObject => {
      return userObject.user.isFavorited;
    })
  }
  // only show guides in browse
  data = data.filter(userObject => {
    return userObject.user.guide;
  })

  let carousel = (<Carousel
    layout="default"
    layoutCardOffset={2}
    ref={isCarousel}
    data={data}
    renderItem={CarouselCardItem}
    sliderWidth={SLIDER_WIDTH}
    itemWidth={ITEM_WIDTH}
    inactiveSlideShift={0}
    useScrollView={true}
    onSnapToItem={(index: Number) => setIndex(index)}
  />)

  if (data.length === 0) carousel = (<Text style={{ marginBottom: 70 }}>No guides match the applied filters. Change filter using the below filter button!</Text>)

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {carousel}
      <View style={styles.paginationView}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('BrowseFilter');
          }}>
          <MaterialCommunityIcon
            name={'filter-plus'}
            color={'rgba(0, 0, 0, 0.5)'}
            size={40}
          />
        </TouchableOpacity>
        <Pagination
          containerStyle={styles.pagination}
          dotsLength={data.length}
          activeDotIndex={index}
          carouselRef={isCarousel}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            backgroundColor: '#99879D'
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
        />
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  pagination: {
    width: 10,
  },
  paginationView: {
    flexDirection: 'row',
    width: '100%',
    height: '8%',
    justifyContent: 'space-around',
  }
})

export default BrowseScreen;