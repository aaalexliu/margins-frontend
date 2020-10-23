import { InMemoryCache, makeVar } from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        currentAccount: {
          read() {
            return currentAccountVar();
          }
        }
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

export const currentAccountVar = makeVar(currentAccountInitialValue);
//only used to temporarily hold password in state to confirm account
//cannot be queried from cache, only used in authentication components
export const passwordVar = makeVar('');