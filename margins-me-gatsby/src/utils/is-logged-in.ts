import { gql, useQuery } from '@apollo/client';

const IS_LOGGED_IN = gql`
  query isAccountLoggedIn {
    currentAccount @client {
      isLoggedIn
    }
  }
`;

export const isLoggedIn = () => {
  
  const { data } = useQuery(IS_LOGGED_IN);

  const isLoggedIn = data.currentAccount.isLoggedIn;
  console.log('IS LOGGED IN CALLED: ', isLoggedIn);
  return isLoggedIn;
};

export default isLoggedIn;