import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './client';

// eslint-disable-next-line react/display-name,react/prop-types
export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
);
