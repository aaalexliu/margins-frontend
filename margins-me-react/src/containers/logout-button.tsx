import React from 'react';
import { Link } from 'react-router-dom';
import { currentAccountVar } from '../cache';
import { Auth } from 'aws-amplify';

export default function LogoutButton() {

  const LogoutCallback = async () => {
    try {
      await Auth.signOut();
      currentAccountVar({
        accessToken: '',
        isLoggedIn: false,
        sub: '',
        email: ''
      })
      console.log('logout success');
    } catch(error) {
      console.log('error signing out', error);
    }
  }

  return (
    <Link to="/" onClick={LogoutCallback}>
      Logout
    </Link>
  )
}
