/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteWorkaroundCommentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteWorkaroundCommentMutation
// ====================================================

export interface deleteWorkaroundCommentMutation_deleteWorkaroundComment {
  __typename: "DeleteWorkaroundCommentOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteWorkaroundCommentMutation {
  deleteWorkaroundComment: deleteWorkaroundCommentMutation_deleteWorkaroundComment;
}

export interface deleteWorkaroundCommentMutationVariables {
  input: DeleteWorkaroundCommentInput;
}
