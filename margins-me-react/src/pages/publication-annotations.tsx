import React, { Fragment } from 'react';
import { useParams } from 'react-router-dom';

const PublicationAnnotations = () => {

  const { publicationId } = useParams();
  return(
    <p>hello {publicationId}</p>
  )
}

export default PublicationAnnotations;