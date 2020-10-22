import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { isLoggedInVar } from '../cache';

export default function LogoutButton() {

  const LogoutCallback = () => {
    isLoggedInVar(false);
    console.log(isLoggedInVar());
  }

  return (
    <Link to="/" onClick={LogoutCallback}>
      Logout
    </Link>
  )
}
