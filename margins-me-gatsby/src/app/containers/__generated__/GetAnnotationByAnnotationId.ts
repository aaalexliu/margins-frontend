/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAnnotationByAnnotationId
// ====================================================

export interface GetAnnotationByAnnotationId_annotationByAnnotationId {
  __typename: "Annotation";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
  annotationId: string;
  color: string | null;
  createdAt: any | null;
  editedHighlightText: string | null;
  editedNoteText: string | null;
  extraEdits: any | null;
  highlightLocation: any | null;
  highlightText: string | null;
  noteLocation: any | null;
  noteText: string | null;
  publicationId: string;
  recordedAt: any | null;
  updatedAt: any | null;
}

export interface GetAnnotationByAnnotationId {
  annotationByAnnotationId: GetAnnotationByAnnotationId_annotationByAnnotationId | null;
}

export interface GetAnnotationByAnnotationIdVariables {
  annotationId: string;
}
