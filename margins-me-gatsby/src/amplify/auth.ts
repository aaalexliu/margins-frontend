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
  if(!isBrowser) return;
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
    }
  } catch (error) {
    return error;
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