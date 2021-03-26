/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateIssueCommentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createIssueCommentMutation
// ====================================================

export interface createIssueCommentMutation_createIssueComment {
  __typename: "CreateIssueCommentOutput";
  ok: boolean;
  error: string | null;
}

export interface createIssueCommentMutation {
  createIssueComment: createIssueCommentMutation_createIssueComment;
}

export interface createIssueCommentMutationVariables {
  input: CreateIssueCommentInput;
}
