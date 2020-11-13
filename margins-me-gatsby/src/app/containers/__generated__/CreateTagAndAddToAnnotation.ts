/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTagAndAddToAnnotation
// ====================================================

export interface CreateTagAndAddToAnnotation_createTag_tag {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
  tagId: string;
  tagName: string;
}

export interface CreateTagAndAddToAnnotation_createTag_query_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId_nodes {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
  tagId: string;
  tagName: string;
}

export interface CreateTagAndAddToAnnotation_createTag_query_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId {
  __typename: "AnnotationTagsByAnnotationTagAnnotationIdAndTagIdManyToManyConnection";
  /**
   * A list of `Tag` objects.
   */
  nodes: (CreateTagAndAddToAnnotation_createTag_query_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId_nodes | null)[];
}

export interface CreateTagAndAddToAnnotation_createTag_query_annotationByAnnotationId {
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
  tagsByAnnotationTagAnnotationIdAndTagId: CreateTagAndAddToAnnotation_createTag_query_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId;
}

export interface CreateTagAndAddToAnnotation_createTag_query {
  __typename: "Query";
  annotationByAnnotationId: CreateTagAndAddToAnnotation_createTag_query_annotationByAnnotationId | null;
}

export interface CreateTagAndAddToAnnotation_createTag {
  __typename: "CreateTagPayload";
  /**
   * The `Tag` that was created by this mutation.
   */
  tag: CreateTagAndAddToAnnotation_createTag_tag | null;
  /**
   * Our root query field type. Allows us to run any query from our mutation payload.
   */
  query: CreateTagAndAddToAnnotation_createTag_query | null;
}

export interface CreateTagAndAddToAnnotation {
  /**
   * Creates a single `Tag`.
   */
  createTag: CreateTagAndAddToAnnotation_createTag | null;
}

export interface CreateTagAndAddToAnnotationVariables {
  tagId: string;
  tagName: string;
  annotationId: string;
  accountId: any;
}
