import { gql } from '@apollo/client';
import * as AnnotationAllTypes from './__generated__/AnnotationAll';

export const ANNOTATION_ALL_FRAGMENT = gql`
  fragment AnnotationAll on Annotation {
    annotationId
    color
    createdAt
    editedHighlightText
    editedNoteText
    extraEdits
    highlightLocation
    highlightText
    noteLocation
    noteText
    publicationId
    recordedAt
    updatedAt
  }
`;

export const extractAnnotationAll = (annotation: AnnotationAllTypes.AnnotationAll) => {
  let {
    extraEdits,
    highlightLocation,
    noteLocation
  } = annotation;
  try {
    extraEdits = extraEdits ? JSON.parse(extraEdits) : undefined;
    highlightLocation = highlightLocation ? JSON.parse(highlightLocation) : undefined;
    noteLocation = noteLocation ? JSON.parse(noteLocation) : undefined;
  } catch (error) {
    console.log('error parsing json return from graphql for annotation');
    console.log(error);
  }
  return {
    ...annotation,
    highlightLocation,
    noteLocation,
    extraEdits
  }
}