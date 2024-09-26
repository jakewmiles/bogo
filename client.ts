
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { makeVar, gql } from '@apollo/client';


const link = new HttpLink({
  uri: 'http://10.10.22.102:3005'
});

export const isLoggedInVar = makeVar(false);
export const userVar = makeVar<any>([]);
export const newUserVar = makeVar<any>([]);
export const filterInterestsVar = makeVar<any>([]);
export const filterFavoritesVar = makeVar<any>(false);
export const usersVar = makeVar<any>([]);

export const GET_USER = gql`
  query GetUser($loginInput: LoginInput!) {
    user(input: $loginInput) {
      id
      firstName
      lastName
      dob
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
    }
  }
`

export const SEND_USER = gql`
  mutation SendUser($signupInput: UserInput!) {
    user(input: $signupInput) {
      id
      firstName
      lastName
      dob
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
      favorites {
        id
        userId
        user1Id
      }
    }
  }
`




const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          }
        }
      }
    }
  }
});

const client = new ApolloClient({
  link,
  cache,
});

export default client
