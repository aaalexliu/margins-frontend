import { gql } from '@apollo/client';

export const typeDefs = gql`

  type CurrentAccount {
    isLoggedIn: Boolean,
    accessToken: String,
    email: String,
    sub: String
  }

  extend type Query {
    currentAccount: CurrentAccount
  }
`