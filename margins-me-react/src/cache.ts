import { InMemoryCache } from '@apollo/client';

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

export const isLoggedInVar = cache.makeVar<boolean>(false);
export const accessTokenVar = cache.makeVar<string>('');
