import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconButton from './IconButton';
import User from '../interfaces/interfaces';
import { gql, useMutation } from '@apollo/client';
import { userVar } from '../client';
import { useNavigation } from '@react-navigation/native';

interface Props {
  user: User
  ownProfile: boolean
}

const TOGGLE_FAVORITES = gql`
  mutation toggleFavorite($favorites: FavoriteInput!) {
    favorites(input: $favorites) {
      id
    }
  }
`;

const Profile = (props: Props) => {
  const user = props.user;
  const navigation = useNavigation();
  const [toggleFavorites, { data }] = useMutation(TOGGLE_FAVORITES)

  const activeUser = userVar().user;

  //the below formats the interests and languages from the array/object based DB notation to the CSV list displayed to users
  let interestsString = '';
  user.interests.forEach(interest => {
    interestsString = interestsString + interest.name + ', ';
    return;
  })
  if (interestsString) {
    interestsString = interestsString.slice(0, -2);
  }
  let languagesString = '';
  user.languages.forEach(language => {
    languagesString = languagesString + language.name + ', ';
  })
  if (languagesString) {
    languagesString = languagesString.slice(0, -2);
  }

  //icon buttons to chat or favourite are not visible when viewing own profile
  let iconButtons = (<View style={styles.iconView}>
    <TouchableOpacity
      onPress={() => {
        toggleFavorites({ variables: { favorites: { userId: activeUser.id, targetUserId: user.id } } });
        user.isFavorited = !(user.isFavorited);
      }}>
      <IconButton
        name={'star'}
        color={user.isFavorited ? 'gold' : 'white'}
        size={30}
        bgColor={'#99879D'}
      />
    </TouchableOpacity>
    <View style={styles.buttonDiv} />
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Contacts', {
          screen: 'ContactsChat', params: {
            id: user.id,
            firstName: user.firstName,
            profilePicture: user.profileImg
          }
        })
      }}>
      <IconButton
        name={'chat-processing-outline'}
        color={'white'}
        size={30}
        bgColor={'#99879D'}
      />
    </TouchableOpacity>
  </View>)


  //view or add hangouts depending on whether this is own profile
  let hangoutButtonText = 'View All';
  if (props.ownProfile) {
    iconButtons = <View />;
    hangoutButtonText = 'Add +';
  }

  //display compass only when user is a guide
  let guideSymbol = (<MaterialCommunityIcons
    name="compass"
    color="black"
    size={27}
  />)

  if (!user.guide) {
    guideSymbol = <View></View>
  }

  return (
    <View style={styles.view}>
      <View style={styles.profileHeader}>
        <Image
          style={styles.profilePicture}
          source={{
            uri: user.profileImg
          }}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.firstName}, {user.dob}</Text>
          <Text style={styles.location}>{user.city}, {user.country}</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            rating={3}
            starSize={20}
            fullStarColor={"#99879D"}
            halfStarColor={"#99879D"}
            emptyStarColor={"#99879D"}
            selectedStar={() => { return; }}
          />
        </View>
        <MaterialCommunityIcons
          name="compass"
          color="black"
          size={27}
        />
      </View>
      <ScrollView style={styles.contentScroll}>
        <Text style={styles.content}>{user.summary}</Text>
      </ScrollView>
      <View style={styles.hangoutHeader}>
        <Text style={styles.hangoutText}>Local hangout spots</Text>
        <TouchableOpacity style={styles.hangoutButton}>
          <Text style={styles.hangoutButtonText}>{hangoutButtonText}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.hangoutImages}>
        <Image source={{ uri: 'https://i.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68' }} style={styles.hangoutImage} />
        <Image source={{ uri: 'https://i.picsum.photos/id/1016/3844/2563.jpg?hmac=WEryKFRvTdeae2aUrY-DHscSmZuyYI9jd_-p94stBvc' }} style={styles.hangoutImage} />
      </View>
      <Text style={styles.categoriesHeading}>Interests</Text>
      <Text style={styles.categories}>{interestsString}</Text>
      <Text style={styles.categoriesHeading}>Speaks</Text>
      <Text style={styles.categories}>{languagesString}</Text>
      {iconButtons}
    </View >
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#ffffff',
    height: 560,
    width: '95%',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: 'rgba(0, 0, 0, .25)',
    shadowOpacity: 1,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profilePicture: {
    height: 69,
    width: 69,
    borderRadius: 35,
  },
  name: {
    fontFamily: 'PTSans_700Bold',
    fontSize: 30,
  },
  location: {
    fontFamily: 'PTSans_400Regular',
    fontSize: 18,
    color: '#99879D',
  },
  headerInfo: {
    alignItems: "flex-start",
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 10,
    width: '60%',
    height: 85,
  },
  contentScroll: {
    height: 140,
  },
  content: {
    fontFamily: 'PTSans_400Regular',
    fontSize: 22,
    color: '#99879D',
  },
  hangoutHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hangoutText: {
    fontFamily: 'RedHatDisplay_700Bold',
    fontSize: 21,
  },
  hangoutButtonText: {
    fontFamily: 'PublicSans_500Medium',
    fontSize: 19,
    textAlign: 'center',
  },
  hangoutButton: {
    backgroundColor: '#99879D',
    borderRadius: 4,
    height: '100%',
    width: 90,
    justifyContent: 'center',
  },
  hangoutImages: {
    marginVertical: 20,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hangoutImage: {
    height: 80,
    width: '47%',
    borderRadius: 6,
  },
  categoriesHeading: {
    fontFamily: 'PTSans_400Regular',
    fontSize: 20,
    color: '#120E21',
  },
  categories: {
    fontFamily: 'PTSans_400Regular',
    fontSize: 18,
    color: '#99879D',
    marginBottom: 10,
  },
  iconView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDiv: {
    height: 60,
    width: 20,
  }
});

export default Profile;
