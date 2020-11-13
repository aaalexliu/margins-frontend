/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTagToAnnotation
// ====================================================

export interface AddTagToAnnotation_createAnnotationTag_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId_nodes {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
  tagId: string;
  tagName: string;
}

export interface AddTagToAnnotation_createAnnotationTag_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId {
  __typename: "AnnotationTagsByAnnotationTagAnnotationIdAndTagIdManyToManyConnection";
  /**
   * A list of `Tag` objects.
   */
  nodes: (AddTagToAnnotation_createAnnotationTag_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId_nodes | null)[];
}

export interface AddTagToAnnotation_createAnnotationTag_annotationByAnnotationId {
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
  /**
   * Reads and enables pagination through a set of `Tag`.
   */
  tagsByAnnotationTagAnnotationIdAndTagId: AddTagToAnnotation_createAnnotationTag_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId;
}

export interface AddTagToAnnotation_createAnnotationTag {
  __typename: "CreateAnnotationTagPayload";
  /**
   * Reads a single `Annotation` that is related to this `AnnotationTag`.
   */
  annotationByAnnotationId: AddTagToAnnotation_createAnnotationTag_annotationByAnnotationId | null;
}

export interface AddTagToAnnotation {
  /**
   * Creates a single `AnnotationTag`.
   */
  createAnnotationTag: AddTagToAnnotation_createAnnotationTag | null;
}

export interface AddTagToAnnotationVariables {
  annotationId: string;
  tagId: string;
}
