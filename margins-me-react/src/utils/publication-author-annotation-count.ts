import { gql } from '@apollo/client';
import * as PublicationAuthorAnnotationCountTypes from './__generated__/PublicationAuthorAnnotationCount';

export const PUBLICATION_AUTHOR_ANNOTATION_COUNT = gql`
  fragment PublicationAuthorAnnotationCount on Publication{
    __typename
    accountId
    additionalMeta
    createdAt
    id
    publicationId
    title
    updatedAt
    annotationsByPublicationId {
      totalCount
    }
    authorsByPublicationAuthorPublicationIdAndAuthorId {
      nodes {
        authorId
        fullName
      }
    }
  }
`;

export const extractPublicationAuthorAnnotationCount = (publication: PublicationAuthorAnnotationCountTypes.PublicationAuthorAnnotationCount) => {
  const {
    publicationId,
    title,
    annotationsByPublicationId: {
      totalCount: annotationCount
    },
    authorsByPublicationAuthorPublicationIdAndAuthorId: {
      nodes: authors
    },
  } = publication;


  const authorNames = authors
    .filter((node): node is PublicationAuthorAnnotationCountTypes.PublicationAuthorAnnotationCount_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes => node !== null)
    .map(author => author.fullName)
    .join(' ');

  return {
    publicationId,
    title,
    annotationCount,
    authorNames
  }
}