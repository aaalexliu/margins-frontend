import React from 'react';
import { LogoutButton } from '../containers';
import { Link } from 'gatsby';
import { isLoggedIn } from '../utils/is-logged-in';


export default function LoginOrLogout() {

  return (
    isLoggedIn() ?
    <LogoutButton />
    :
    <Link to="/login">
      Login
    </Link>
  )
}
