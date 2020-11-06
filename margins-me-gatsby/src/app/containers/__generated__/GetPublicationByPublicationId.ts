/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPublicationByPublicationId
// ====================================================

export interface GetPublicationByPublicationId_publicationByPublicationId_annotationsByPublicationId {
  __typename: "AnnotationsConnection";
  /**
   * The count of *all* `Annotation` you could get from the connection.
   */
  totalCount: number;
}

export interface GetPublicationByPublicationId_publicationByPublicationId_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes {
  __typename: "Author";
  authorId: string;
  fullName: string;
}

export interface GetPublicationByPublicationId_publicationByPublicationId_authorsByPublicationAuthorPublicationIdAndAuthorId {
  __typename: "PublicationAuthorsByPublicationAuthorPublicationIdAndAuthorIdManyToManyConnection";
  /**
   * A list of `Author` objects.
   */
  nodes: (GetPublicationByPublicationId_publicationByPublicationId_authorsByPublicationAuthorPublicationIdAndAuthorId_nodes | null)[];
}

export interface GetPublicationByPublicationId_publicationByPublicationId_bookByPublicationId {
  __typename: "Book";
  bookTitle: string;
  bookType: string | null;
  description: string | null;
  imageUrl: string | null;
  languageCode: string | null;
  isbn13: string | null;
  publicationDate: any | null;
  publicationId: string;
  publisher: string | null;
}

export interface GetPublicationByPublicationId_publicationByPublicationId {
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
  annotationsByPublicationId: GetPublicationByPublicationId_publicationByPublicationId_annotationsByPublicationId;
  /**
   * Reads and enables pagination through a set of `Author`.
   */
  authorsByPublicationAuthorPublicationIdAndAuthorId: GetPublicationByPublicationId_publicationByPublicationId_authorsByPublicationAuthorPublicationIdAndAuthorId;
  /**
   * Reads a single `Book` that is related to this `Publication`.
   */
  bookByPublicationId: GetPublicationByPublicationId_publicationByPublicationId_bookByPublicationId | null;
}

export interface GetPublicationByPublicationId {
  publicationByPublicationId: GetPublicationByPublicationId_publicationByPublicationId | null;
}

export interface GetPublicationByPublicationIdVariables {
  publicationId: string;
}
