/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTag
// ====================================================

export interface DeleteTag_deleteTagByTagId {
  __typename: "DeleteTagPayload";
  deletedTagId: string | null;
}

export interface DeleteTag {
  /**
   * Deletes a single `Tag` using a unique key.
   */
  deleteTagByTagId: DeleteTag_deleteTagByTagId | null;
}

export interface DeleteTagVariables {
  tagId: string;
}
