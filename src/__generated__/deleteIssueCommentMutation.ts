/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteIssueCommentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteIssueCommentMutation
// ====================================================

export interface deleteIssueCommentMutation_deleteIssueComment {
  __typename: "DeleteIssueCommentOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteIssueCommentMutation {
  deleteIssueComment: deleteIssueCommentMutation_deleteIssueComment;
}

export interface deleteIssueCommentMutationVariables {
  input: DeleteIssueCommentInput;
}
