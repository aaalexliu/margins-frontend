import { gql } from '@apollo/client';
// import * as PublicationAuthorAnnotationCountTypes from './__generated__/PublicationAuthorAnnotationCount';
import { PublicationAuthorAnnotationCountFragment, Author } from '../../__generated__/graphql-types';

export const PUBLICATION_AUTHOR_ANNOTATION_COUNT_FRAGMENT = gql`
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

export const extractPublicationAuthorAnnotationCount = (publication: PublicationAuthorAnnotationCountFragment) => {
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
    .filter((node): node is Author => node !== null)
    .map(author => author.fullName)
    .join(', ');

  const notNullAuthors = authors.filter((author): author is Pick<Author, "id" | "authorId" | "fullName"> => author != null);

  return {
    publicationId,
    title,
    annotationCount,
    authorNames,
    authors: notNullAuthors
  }
}