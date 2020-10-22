import React from 'react';
import { LogoutButton } from '../containers';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const IS_LOGGED_IN = gql`
  query isUserLoggedIn {
    isLoggedIn @client
  }
`;

export default function LoginOrLogout() {
  
  const { data } = useQuery(IS_LOGGED_IN);

  const isLoggedIn = data.isLoggedIn;

  return (
    isLoggedIn ?
    <LogoutButton />
    :
    <Link to="/login">
      Login
    </Link>
  )
}
