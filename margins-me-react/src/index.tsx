import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Pages from './pages';
import { Loading } from './components';
import './index.less';
import { BrowserRouter } from 'react-router-dom';

import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  useQuery,
  gql,
} from '@apollo/client';
import { cache } from './cache';

import { Amplify, Auth } from 'aws-amplify';
import awsConfig from './aws.config';
import { isLoggedInVar}  from './cache';



export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    # cartItems: [ID!]!
  }
`;

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: awsConfig.cognito.REGION,
    userPoolId: awsConfig.cognito.USER_POOL_ID,
    identityPoolId: awsConfig.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: awsConfig.cognito.APP_CLIENT_ID
  }
});

function CheckLogin() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  Auth.currentSession().then(user => {
    if (!!user) {
      isLoggedInVar(true);
    }
    setIsAuthenticating(false);
  })

  return (
    isAuthenticating ? <Loading /> : <Pages />
  )
}

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: localStorage.getItem('token') || '',
    'client-name': 'Margins Me [dev]',
    'client-version': '1.0.0',
  },
  typeDefs,
  resolvers: {},
});


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <CheckLogin />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// Set up our apollo-client to point at the server we created
// this can be local or a remote endpoint

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
