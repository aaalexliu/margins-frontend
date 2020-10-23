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
  unverifiedEmail: '',
  account: null
}

export const currentAccountVar = cache.makeVar(currentAccountInitialValue);

export const isLoggedInVar = cache.makeVar<boolean>(false);
export const accessTokenVar = cache.makeVar<string>('');
export const unverifiedEmail = cache.makeVar<string>('');
