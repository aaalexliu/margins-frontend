import { Amplify, Auth } from 'aws-amplify';
import awsConfig from './aws.config';
// import { currentAccountVar, passwordVar } from '../apollo/cache';
import { CognitoUser } from '@aws-amplify/auth';
import { currentAccountVar } from '../apollo/cache';


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

type AuthCallback = (err: any, res?: any) => any;

const setSession = (callback: AuthCallback) => {
  if(!isBrowser) return;

  Auth.currentSession().then(user => {
    console.log(user);
    // console.log(user.getAccessToken());

    if (!!user) {
      const accessToken = user.getAccessToken().getJwtToken();
      const idToken = user.getIdToken()
      const email = idToken.payload.email;
      const sub = idToken.payload.sub;

      callback(null, {
        accessToken,
        email,
        sub,
        // isLoggedIn: true
      })
    } else {
      console.log('no current user');
    }
  }).catch(error => {
    callback(error);
  })
}

const login = async (account: {username: string, password: string}, callback: AuthCallback) => {
  const { username, password } = account;
  try {
    const cognitoUser: CognitoUser = await Auth.signIn(username, password);
    const userSession = cognitoUser.getSignInUserSession();
      if (!userSession) throw new Error('sign in session null');
      const accessToken = userSession.getAccessToken().getJwtToken();

      const { attributes } = await Auth.currentAuthenticatedUser();
      callback(null, {
        // isLoggedIn: true,
        accessToken,
        email: attributes.email,
        sub: attributes.sub
      })
  } catch (error) {
    callback(error);
  }
}

const signup = async (account: {username: string, password: string}, callback: AuthCallback) => {
  const { username, password }  = account;
  try {
    const { user } = await Auth.signUp({
      username,
      password
    });
    callback(null, 'success');
  } catch (error) {
    console.log('error signing up:', error);
    callback(error);
  }
}

const confirmSignup = async (account: {username: string, password: string, code: string},
  callback: AuthCallback) => {
    const {username, password, code} = account;
    try {
      const success = await Auth.confirmSignUp(
        username,
        code
      );
      console.log(success);
      const user = await Auth.signIn(username, password);
      setSession(callback);
    } catch(error) {
      console.log(error);
    }
  }

const logout = async(callback: AuthCallback) => {
  try {
    await Auth.signOut();
    callback(null, 'success');
  } catch(error) {
    console.log('error logging out');
    console.log('error');
    callback(error);
  }
}