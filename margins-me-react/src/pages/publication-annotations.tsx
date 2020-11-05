import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Loading } from '../components';

import {
  PUBLICATION_AUTHOR_ANNOTATION_COUNT,
  extractPublicationAuthorAnnotationCount
} from '../utils/publication-author-annotation-count';
import * as GetPublicationByPublicationIdTypes from './__generated__/GetPublicationByPublicationId';
import { isNullOrUndefined } from 'util';

export const GET_PUBLICATION_BY_PUBLICATION_ID = gql`
  query GetPublicationByPublicationId($publicationId: String!) {
    publicationByPublicationId(publicationId: $publicationId) {
      ...PublicationAuthorAnnotationCount
      bookByPublicationId {
        bookTitle
        bookType
        description
        imageUrl
        languageCode
        isbn13
        publicationDate
        publicationId
        publisher
      }
    }
  }
  ${PUBLICATION_AUTHOR_ANNOTATION_COUNT}
`;



const PublicationAnnotations = () => {

  const { publicationId } = useParams();

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery<
    GetPublicationByPublicationIdTypes.GetPublicationByPublicationId,
    GetPublicationByPublicationIdTypes.GetPublicationByPublicationIdVariables
  >(
    GET_PUBLICATION_BY_PUBLICATION_ID,
    {
      variables: {
        publicationId
      }
    }
  );

  if (loading) return <Loading />;
  if (error || !data) return <p>ERROR</p>;

  const publicationData = data.publicationByPublicationId !== null ?
    extractPublicationAuthorAnnotationCount(data.publicationByPublicationId)
    : null;

  return(
    <Fragment>
    {
      publicationData !== null ?
      <p>hello {publicationData.title}</p>
      :
      <p>boo</p>
    }
        </Fragment>
  )
}

export default PublicationAnnotations;