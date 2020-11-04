/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PublicationListItem
// ====================================================

export interface PublicationListItem_annotationsByPublicationId {
  __typename: "AnnotationsConnection";
  /**
   * The count of *all* `Annotation` you could get from the connection.
   */
  totalCount: number;
}

export interface PublicationListItem_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes {
  __typename: "Author";
  authorId: string;
  fullName: string;
}

export interface PublicationListItem_authorsByPublicationAuthorPublicationIdAndAuthorId {
  __typename: "PublicationAuthorsByPublicationAuthorPublicationIdAndAuthorIdManyToManyConnection";
  /**
   * A list of `Author` objects.
   */
  nodes: (PublicationListItem_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes | null)[];
}

export interface PublicationListItem {
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
  annotationsByPublicationId: PublicationListItem_annotationsByPublicationId;
  /**
   * Reads and enables pagination through a set of `Author`.
   */
  authorsByPublicationAuthorPublicationIdAndAuthorId: PublicationListItem_authorsByPublicationAuthorPublicationIdAndAuthorId;
}
