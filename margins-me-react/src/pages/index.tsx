import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';

// import Launch from './launch';
// import Launches from './launches';
// import Cart from './cart';
// import Profile from './profile';

import Login from './login';
import Signup from './signup';
import { PageLayout } from '../components';

export default function Pages() {
  return (
    <Fragment>
      <PageLayout>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
        </Routes>
      </PageLayout>
    </Fragment>
  );
}

export { default as Loading } from '../pages/loading';