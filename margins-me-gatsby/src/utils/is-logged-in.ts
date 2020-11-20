// import { gql, useQuery } from '@apollo/client';
import { currentAccountVar } from '../apollo/cache';

// const IS_LOGGED_IN = gql`
//   query isAccountLoggedIn {
//     currentAccount @client {
//       isLoggedIn
//     }
//   }
// `;

// export const isLoggedIn = () => {
  
//   const { data } = useQuery(IS_LOGGED_IN);

//   const isLoggedIn = data.currentAccount.isLoggedIn;
//   console.log('IS LOGGED IN CALLED: ', isLoggedIn);
//   return isLoggedIn;
// };

export const isLoggedIn = () => {
  return currentAccountVar().isLoggedIn;
}

export default isLoggedIn;