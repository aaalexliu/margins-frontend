/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllTags
// ====================================================

export interface GetAllTags_allTags_nodes {
  __typename: "Tag";
  tagId: string;
  tagName: string;
  /**
   * A globally unique identifier. Can be used in various places throughout the system to identify this single value.
   */
  id: string;
}

export interface GetAllTags_allTags {
  __typename: "TagsConnection";
  /**
   * A list of `Tag` objects.
   */
  nodes: (GetAllTags_allTags_nodes | null)[];
}

export interface GetAllTags {
  /**
   * Reads and enables pagination through a set of `Tag`.
   */
  allTags: GetAllTags_allTags | null;
}
