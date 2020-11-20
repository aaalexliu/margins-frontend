import { Amplify, Auth } from 'aws-amplify';
import awsConfig from './aws.config';
import { CognitoUser } from '@aws-amplify/auth';


export const isBrowser = typeof window !== 'undefined';

//not entirely sure what happens in configure,
// to play it safe only configure in browser
isBrowser && Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: awsConfig.cognito.REGION,
    userPoolId: awsConfig.cognito.USER_POOL_ID,
    identityPoolId: awsConfig.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: awsConfig.cognito.APP_CLIENT_ID
  }
});

// type AuthCallback = (err: any, res?: any) => any;

export const getAccountFromSession = async () => {
  if(!isBrowser) return { error: 'not browser'};
  let user;
  try {
    user = await Auth.currentSession();
    if (!!user) {
      const accessToken = user.getAccessToken().getJwtToken();
      const idToken = user.getIdToken()
      const email = idToken.payload.email;
      const sub = idToken.payload.sub;

      return {
        account: {
          accessToken,
          email,
          sub,
        }
      };
    } else {
      console.log('no current user');
      return {
        error: 'no current user'
      };
    }
  } catch (error) {
    return {
      error
    };
  }
}

export const login = async (username: string, password: string) => {
  try {
    const cognitoUser: CognitoUser = await Auth.signIn(username, password);
    const userSession = cognitoUser.getSignInUserSession();
      if (!userSession) throw new Error('sign in session null');
      const accessToken = userSession.getAccessToken().getJwtToken();

      const { attributes } = await Auth.currentAuthenticatedUser();
      return {
        account: {
          accessToken,
          email: attributes.email,
          sub: attributes.sub
        }
      };
  } catch (error) {
    return {
      error
    }
  }
}

export const signup = async (username: string, password: string) => {
  try {
    const { user } = await Auth.signUp({
      username,
      password
    });
    return{
      success: 'success'
    };
  } catch (error) {
    console.log('error signing up:', error);
    return {
      error
    }
  }
}

export const confirmSignup = async (username: string, password: string, code: string) => {
    try {
      const success = await Auth.confirmSignUp(
        username,
        code
      );
      console.log(success);
      const user = await Auth.signIn(username, password);
      return await getAccountFromSession();;
    } catch(error) {
      console.log('error confirming user');
      console.log(error);
      return {
        error
      }
    }
  }

export const logout = async () => {
  try {
    await Auth.signOut();
    return {
      success: 'success'
    };
  } catch(error) {
    console.log('error logging out');
    return {
      error
    }
  }
}

// Sample code from gatsby auh0 example
// import auth0js from 'auth0-js';

// export const isBrowser = typeof window !== 'undefined';

// // To speed things up, we’ll keep the profile stored unless the user logs out.
// // This prevents a flicker while the HTTP round-trip completes.
// let profile = false;

// const tokens = {
//   accessToken: false,
//   idToken: false,
//   expiresAt: false
// };

// // Only instantiate Auth0 if we’re in the browser.
// const auth0 = isBrowser
//   ? new auth0js.WebAuth({
//       domain: process.env.AUTH0_DOMAIN,
//       clientID: process.env.AUTH0_CLIENTID,
//       redirectUri: process.env.AUTH0_CALLBACK,
//       audience: process.env.AUTH0_AUDIENCE,
//       responseType: 'token id_token',
//       scope: 'openid profile email'
//     })
//   : {};

// export const login = () => {
//   if (!isBrowser) {
//     return;
//   }

//   auth0.authorize();
// };

// export const logout = () => {
//   localStorage.setItem('isLoggedIn', false);
//   profile = false;

//   const { protocol, host } = window.location;
//   const returnTo = `${protocol}//${host}`;

//   auth0.logout({ returnTo });
// };

// const setSession = callback => (err, authResult) => {
//   if (!isBrowser) {
//     return;
//   }

//   if (err) {
//     console.error(err);
//     callback();
//     return;
//   }

//   if (authResult && authResult.accessToken && authResult.idToken) {
//     let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
//     tokens.accessToken = authResult.accessToken;
//     tokens.idToken = authResult.idToken;
//     tokens.expiresAt = expiresAt;
//     profile = authResult.idTokenPayload;
//     localStorage.setItem('isLoggedIn', true);
//     callback();
//   }
// };

// export const silentAuth = callback => {
//   if (!isBrowser) {
//     return;
//   }

//   if (!isAuthenticated()) return callback();
//   auth0.checkSession({}, setSession(callback));
// };

// export const handleAuthentication = (callback = () => {}) => {
//   if (!isBrowser) {
//     return;
//   }

//   auth0.parseHash(setSession(callback));
// };

// export const isAuthenticated = () => {
//   if (!isBrowser) {
//     return;
//   }

//   return localStorage.getItem('isLoggedIn') === 'true';
// };

// export const getAccessToken = () => {
//   if (!isBrowser) {
//     return '';
//   }

//   return tokens.accessToken;
// };

// export const getUserInfo = () => {
//   if (profile) {
//     return profile;
//   }
// };