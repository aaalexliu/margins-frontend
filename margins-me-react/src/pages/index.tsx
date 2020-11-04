import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';

// import Launch from './launch';
// import Launches from './launches';
// import Cart from './cart';
// import Profile from './profile';

import Login from './login';
import Signup from './signup';
import ConfirmSignup from './confirm-signup';
import { PageLayout } from '../components';
import Publications from './publications';
import PublicationAnnotations from './publication-annotations';

export default function Pages() {
  return (
    <Fragment>
      <PageLayout>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/confirm-signup" element={<ConfirmSignup />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/publications/:publicationId" element={<PublicationAnnotations />} />
        </Routes>
      </PageLayout>
    </Fragment>
  );
}

export { default as LoadingPage } from '../pages/loading';