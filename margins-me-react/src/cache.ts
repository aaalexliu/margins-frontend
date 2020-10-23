import { InMemoryCache } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentAccount: {
          read() {
            return currentAccountVar();
          }
        }
        // isLoggedIn: {
        //   read() {
        //     return isLoggedInVar();
        //   }
        // },
        // accessToken: {
        //   read() {
        //     return accessTokenVar();
        //   }
        // }, 
        // unverifiedEmail: {
        //   read() {
        //     return unverifiedEmail();
        //   }
        // }
      }
    }
  }
});

const currentAccountInitialValue = {
  isLoggedIn: false,
  accessToken: '',
  email: '',
  sub: ''
}

export const currentAccountVar = cache.makeVar(currentAccountInitialValue);
