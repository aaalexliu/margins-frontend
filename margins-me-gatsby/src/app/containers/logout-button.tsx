import React from 'react';
import { Link } from 'gatsby';
import { currentAccountVar } from '../../apollo/cache';
import { logout } from '../../amplify/auth';
import { message } from 'antd';

export default function LogoutButton() {

  const LogoutCallback = async () => {
    const logoutResponse = await logout();
    if (logoutResponse.success) {
      currentAccountVar({
        accessToken: '',
        isLoggedIn: false,
        sub: '',
        email: ''
      });
      console.log('logout success');
      message.success('Successfully Logged Out!')
    } else {
      const error = logoutResponse.error;
      console.log('error signing out', error);
    }
  }

  return (
    <Link to="/" onClick={LogoutCallback}>
      Logout
    </Link>
  )
}
