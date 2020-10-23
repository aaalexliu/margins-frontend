import { gql } from '@apollo/client';

export const typeDefs = gql`

  type CurrentAccount {
    isLoggedIn: Boolean,
    accessToken: String,
    unverifiedEmail: String,
    account: Account
  }

  extend type Query {
    currentAccount: CurrentAccount
  }
`