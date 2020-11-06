/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PublicationsOrderBy } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetAllPublications
// ====================================================

export interface GetAllPublications_allPublications_pageInfo {
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

export interface GetAllPublications_allPublications_edges_node_annotationsByPublicationId {
  __typename: "AnnotationsConnection";
  /**
   * The count of *all* `Annotation` you could get from the connection.
   */
  totalCount: number;
}

export interface GetAllPublications_allPublications_edges_node_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes {
  __typename: "Author";
  authorId: string;
  fullName: string;
}

export interface GetAllPublications_allPublications_edges_node_authorsByPublicationAuthorPublicationIdAndAuthorId {
  __typename: "PublicationAuthorsByPublicationAuthorPublicationIdAndAuthorIdManyToManyConnection";
  /**
   * A list of `Author` objects.
   */
  nodes: (GetAllPublications_allPublications_edges_node_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes | null)[];
}

export interface GetAllPublications_allPublications_edges_node {
  __typename: "Publication";
  accountId: any;
  additionalMeta: any | null;
  createdAt: any | null;
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
  publicationId: string;
  title: string;
  updatedAt: any | null;
  /**
   * Reads and enables pagination through a set of `Annotation`.
   */
  annotationsByPublicationId: GetAllPublications_allPublications_edges_node_annotationsByPublicationId;
  /**
   * Reads and enables pagination through a set of `Author`.
   */
  authorsByPublicationAuthorPublicationIdAndAuthorId: GetAllPublications_allPublications_edges_node_authorsByPublicationAuthorPublicationIdAndAuthorId;
}

export interface GetAllPublications_allPublications_edges {
  __typename: "PublicationsEdge";
  /**
   * A cursor for use in pagination.
   */
  cursor: any | null;
  /**
   * The `Publication` at the end of the edge.
   */
  node: GetAllPublications_allPublications_edges_node | null;
}

export interface GetAllPublications_allPublications {
  __typename: "PublicationsConnection";
  /**
   * The count of *all* `Publication` you could get from the connection.
   */
  totalCount: number;
  /**
   * Information to aid in pagination.
   */
  pageInfo: GetAllPublications_allPublications_pageInfo;
  /**
   * A list of edges which contains the `Publication` and cursor to aid in pagination.
   */
  edges: GetAllPublications_allPublications_edges[];
}

export interface GetAllPublications {
  /**
   * Reads and enables pagination through a set of `Publication`.
   */
  allPublications: GetAllPublications_allPublications | null;
}

export interface GetAllPublicationsVariables {
  orderBy?: PublicationsOrderBy[] | null;
  first?: number | null;
  afterCursor?: any | null;
}
