/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteAnnotationTag
// ====================================================

export interface DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_tagByTagId_annotationTagsByTagId {
  __typename: "AnnotationTagsConnection";
  /**
   * The count of *all* `AnnotationTag` you could get from the connection.
   */
  totalCount: number;
}

export interface DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_tagByTagId {
  __typename: "Tag";
  /**
   * Reads and enables pagination through a set of `AnnotationTag`.
   */
  annotationTagsByTagId: DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_tagByTagId_annotationTagsByTagId;
  tagId: string;
  tagName: string;
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
}

export interface DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId_nodes {
  __typename: "Tag";
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
  tagId: string;
  tagName: string;
}

export interface DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId {
  __typename: "AnnotationTagsByAnnotationTagAnnotationIdAndTagIdManyToManyConnection";
  /**
   * A list of `Tag` objects.
   */
  nodes: (DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId_nodes | null)[];
}

export interface DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_annotationByAnnotationId {
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
  tagsByAnnotationTagAnnotationIdAndTagId: DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_annotationByAnnotationId_tagsByAnnotationTagAnnotationIdAndTagId;
}

export interface DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId {
  __typename: "DeleteAnnotationTagPayload";
  /**
   * Reads a single `Tag` that is related to this `AnnotationTag`.
   */
  tagByTagId: DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_tagByTagId | null;
  /**
   * Reads a single `Annotation` that is related to this `AnnotationTag`.
   */
  annotationByAnnotationId: DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId_annotationByAnnotationId | null;
}

export interface DeleteAnnotationTag {
  /**
   * Deletes a single `AnnotationTag` using a unique key.
   */
  deleteAnnotationTagByAnnotationIdAndTagId: DeleteAnnotationTag_deleteAnnotationTagByAnnotationIdAndTagId | null;
}

export interface DeleteAnnotationTagVariables {
  annotationId: string;
  tagId: string;
}
