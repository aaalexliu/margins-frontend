import { gql } from '@apollo/client';

export const GET_ALL_TAGS = gql`
  query GetAllTags {
    allTags {
      nodes {
        tagId
        tagName
        id
      }
    }
  }
`