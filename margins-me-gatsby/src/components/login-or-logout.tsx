import React from 'react';
import { LogoutButton } from '../containers';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'gatsby';

const IS_LOGGED_IN = gql`
  query isAccountLoggedIn {
    currentAccount @client {
      isLoggedIn
    }
  }
`;

export default function LoginOrLogout() {
  
  const { data } = useQuery(IS_LOGGED_IN);

  const isLoggedIn = data.currentAccount.isLoggedIn;

  return (
    isLoggedIn ?
    <LogoutButton />
    :
    <Link to="/login">
      Login
    </Link>
  )
}
