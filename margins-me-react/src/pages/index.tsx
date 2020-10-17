import React, { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

// import Launch from './launch';
// import Launches from './launches';
// import Cart from './cart';
// import Profile from './profile';
import { PageLayout } from '../components';

export default function Pages() {
  return (
    <Fragment>
      <PageLayout>
        <BrowserRouter>
          {/* <Launches path="/" />
          <Launch path="launch/:launchId" />
          <Cart path="cart" />
          <Profile path="profile" /> */}
        </BrowserRouter>
      </PageLayout>
    </Fragment>
  );
}
