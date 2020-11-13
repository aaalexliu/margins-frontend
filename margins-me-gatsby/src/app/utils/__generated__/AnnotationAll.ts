/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AnnotationAll
// ====================================================

export interface AnnotationAll_tagsByAnnotationTagAnnotationIdAndTagId_nodes {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
  tagId: string;
  tagName: string;
}

export interface AnnotationAll_tagsByAnnotationTagAnnotationIdAndTagId {
  __typename: "AnnotationTagsByAnnotationTagAnnotationIdAndTagIdManyToManyConnection";
  /**
   * A list of `Tag` objects.
   */
  nodes: (AnnotationAll_tagsByAnnotationTagAnnotationIdAndTagId_nodes | null)[];
}

export interface AnnotationAll {
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
  tagsByAnnotationTagAnnotationIdAndTagId: AnnotationAll_tagsByAnnotationTagAnnotationIdAndTagId;
}
