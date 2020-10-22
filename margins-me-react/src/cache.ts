import { InMemoryCache, makeVar, Reference } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        isLoggedIn: {
          read() {
            return isLoggedInVar();
          }
        },
        accessToken: {
          read() {
            return accessTokenVar();
          }
        },
      }
    }
  }
});

export const isLoggedInVar = makeVar<boolean>(false);
export const accessTokenVar = makeVar<string>('');
