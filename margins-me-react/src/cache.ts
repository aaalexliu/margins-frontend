import { InMemoryCache } from '@apollo/client';
import { CognitoUser } from '@aws-amplify/auth';

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
        currentCognitoUser: {
          read() {
            return currentCognitoUserVar();
          }
        }
      }
    }
  }
});

export const isLoggedInVar = cache.makeVar<boolean>(false);
export const accessTokenVar = cache.makeVar<string>('');
export const currentCognitoUserVar = cache.makeVar<CognitoUser | null>(null);
