import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { PublicationCard } from '../containers';


const PublicationAnnotations = () => {

  const { publicationId } = useParams();

  return (
    <PublicationCard publicationId={publicationId} />
  )
}

export default PublicationAnnotations;