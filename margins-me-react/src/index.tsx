import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Pages from './pages';
import './index.less';
import { BrowserRouter } from 'react-router-dom';

import { Amplify } from 'aws-amplify';

import awsConfig from './aws.config';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: awsConfig.cognito.REGION,
    userPoolId: awsConfig.cognito.USER_POOL_ID,
    identityPoolId: awsConfig.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: awsConfig.cognito.APP_CLIENT_ID
  }
})

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Pages/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
