import fetch from 'isomorphic-fetch';
import {
  ApolloClient,
  createHttpLink,
  NormalizedCacheObject
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { cache, currentAccountVar } from './cache';
import { typeDefs } from './client-schema';

const httpLink = createHttpLink({
  uri: 'http://ec2-34-232-69-157.compute-1.amazonaws.com:8080/graphql',
  fetch,
});

const authLink = setContext((_, { headers }) => {
  // get access token from cache if exists
  const accessToken = currentAccountVar().accessToken;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : ""
    }
  }
})

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
  typeDefs,
  connectToDevTools: true,
});