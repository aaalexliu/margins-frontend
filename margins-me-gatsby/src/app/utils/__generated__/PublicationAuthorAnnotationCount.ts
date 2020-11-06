/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PublicationAuthorAnnotationCount
// ====================================================

export interface PublicationAuthorAnnotationCount_annotationsByPublicationId {
  __typename: "AnnotationsConnection";
  /**
   * The count of *all* `Annotation` you could get from the connection.
   */
  totalCount: number;
}

export interface PublicationAuthorAnnotationCount_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes {
  __typename: "Author";
  authorId: string;
  fullName: string;
}

export interface PublicationAuthorAnnotationCount_authorsByPublicationAuthorPublicationIdAndAuthorId {
  __typename: "PublicationAuthorsByPublicationAuthorPublicationIdAndAuthorIdManyToManyConnection";
  /**
   * A list of `Author` objects.
   */
  nodes: (PublicationAuthorAnnotationCount_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes | null)[];
}

export interface PublicationAuthorAnnotationCount {
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
  annotationsByPublicationId: PublicationAuthorAnnotationCount_annotationsByPublicationId;
  /**
   * Reads and enables pagination through a set of `Author`.
   */
  authorsByPublicationAuthorPublicationIdAndAuthorId: PublicationAuthorAnnotationCount_authorsByPublicationAuthorPublicationIdAndAuthorId;
}
