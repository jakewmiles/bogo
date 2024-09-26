import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Map from '../components/Map';
import ToggleableButtonFlatlist from '../components/ToggleableButtonFlatlist';
import FloatingCard from '../components/FloatingCard';
import { gql, useMutation } from '@apollo/client';
import { userVar, filterInterestsVar, filterFavoritesVar } from '../client';
import { INTERESTS } from '../services/queriesApi';
import { useQuery } from '@apollo/client';

interface Props {
  navigation: any;
  route: any;
}

const UPDATE_LOCATION_FILTER = gql`
  mutation UpdateLocationFilter($city: UserInput!) {
    user(input: $city) {
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

const BrowseFilter = (props: Props) => {

  const [updateLocationFilter, { data }] = useMutation(UPDATE_LOCATION_FILTER)
  const { loading, error, data: dataInterests } = useQuery(INTERESTS);
  while (loading) {
    return null;
  }

  let interestsArray = dataInterests.interests;
  interestsArray = interestsArray.map((interest: any) => { return { ...interest, selected: false } });

  const favoriteToggle = [{ id: "1", name: "Filter by favorites", selected: false }]

  const userInfo = userVar().user;

  function onSelectLocation(city: String) {
    updateLocationFilter({ variables: { city: { id: userInfo.id, filterCity: city } } });
    userVar({ user: { ...userInfo, filterCity: city } });
  }

  return (
    <ScrollView contentContainerStyle={styles.viewContainer}>
      <Text style={styles.heading}>Filter by destination</Text>
      <Map title={''} currentLocation={false} onSelectLocation={onSelectLocation} />
      <Text style={styles.heading}>Filter by interest</Text>
      <FloatingCard cardWidth={'85%'}>
        <View style={styles.toggleView}>
          <ToggleableButtonFlatlist array={interestsArray} />
        </View>
      </FloatingCard>
      <ToggleableButtonFlatlist array={favoriteToggle} />
      <TouchableOpacity style={styles.hangoutButton}
        onPress={() => {
          const selectedInterests = interestsArray.filter((interest: any) => interest.selected === true)
          filterInterestsVar({ selectedInterests });
          filterFavoritesVar(favoriteToggle[0].selected);
          props.navigation.navigate({
            name: "BrowseScreen",
            params: {
              filter: {
                user: userVar(),
                interests: interestsArray,
                favorite: favoriteToggle[0].selected
              }
            }
          });
        }}>
        <Text style={styles.hangoutButtonText}>Apply Filter</Text>
      </TouchableOpacity>
    </ScrollView >
  )
}

const styles = StyleSheet.create({
  viewContainer: {
    paddingVertical: '10%',
    paddingHorizontal: 0,
    alignItems: 'center',
  },
  view: {
    height: 500,
    flex: 1,
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'PTSans_400Regular',
    fontSize: 22,
    color: '#99879D',
    alignSelf: 'center',
    paddingHorizontal: 50,
    paddingTop: 30,
    textAlign: 'center',
  },
  toggleView: {
    paddingTop: 10,
    height: 250,
  },
  hangoutButtonText: {
    fontFamily: 'PublicSans_500Medium',
    fontSize: 19,
    textAlign: 'center',
  },
  hangoutButton: {
    backgroundColor: '#99879D',
    borderRadius: 10,
    height: 50,
    width: 150,
    marginTop: 20,
    justifyContent: 'center',
  },
  favoritesButton: {
    marginVertical: 15,
  }
})

export default BrowseFilter;