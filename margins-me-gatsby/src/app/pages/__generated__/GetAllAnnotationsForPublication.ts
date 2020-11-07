/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllAnnotationsForPublication
// ====================================================

export interface GetAllAnnotationsForPublication_allAnnotations_edges_node {
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

export interface GetAllAnnotationsForPublication_allAnnotations_edges {
  __typename: "AnnotationsEdge";
  /**
   * A cursor for use in pagination.
   */
  cursor: any | null;
  /**
   * The `Annotation` at the end of the edge.
   */
  node: GetAllAnnotationsForPublication_allAnnotations_edges_node | null;
}

export interface GetAllAnnotationsForPublication_allAnnotations_pageInfo {
  __typename: "PageInfo";
  /**
   * When paginating forwards, the cursor to continue.
   */
  endCursor: any | null;
  /**
   * When paginating forwards, are there more items?
   */
  hasNextPage: boolean;
  /**
   * When paginating backwards, are there more items?
   */
  hasPreviousPage: boolean;
  /**
   * When paginating backwards, the cursor to continue.
   */
  startCursor: any | null;
}

export interface GetAllAnnotationsForPublication_allAnnotations {
  __typename: "AnnotationsConnection";
  /**
   * A list of edges which contains the `Annotation` and cursor to aid in pagination.
   */
  edges: GetAllAnnotationsForPublication_allAnnotations_edges[];
  /**
   * The count of *all* `Annotation` you could get from the connection.
   */
  totalCount: number;
  /**
   * Information to aid in pagination.
   */
  pageInfo: GetAllAnnotationsForPublication_allAnnotations_pageInfo;
}

export interface GetAllAnnotationsForPublication {
  /**
   * Reads and enables pagination through a set of `Annotation`.
   */
  allAnnotations: GetAllAnnotationsForPublication_allAnnotations | null;
}

export interface GetAllAnnotationsForPublicationVariables {
  publicationId: string;
  first?: number | null;
  afterCursor?: any | null;
}
