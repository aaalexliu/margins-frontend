import { currentAccountVar } from '../../apollo/cache';
// import * as GetAccountIdTypes from './__generated__/GetAccountId';

// const GET_ACCOUNT_ID = gql`
//   query GetAccountId {
//     currentAccount @client {
//       sub
//     }
//   }
// `;

// export const getAccountId = () => {
  
//   const { data } = useQuery<
//     GetAccountIdTypes.GetAccountId
//   >(GET_ACCOUNT_ID);

//   const accountId = data?.currentAccount?.sub;
//   console.log('Get Account ID:', accountId);
//   return accountId;
// };

export const getAccountId = () => {
  const accountId = currentAccountVar().sub;
  return accountId;
}

export default getAccountId;