/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateWorkaroundCommentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createWorkaroundCommentMutation
// ====================================================

export interface createWorkaroundCommentMutation_createWorkaroundComment {
  __typename: "CreateWorkaroundCommentOutput";
  ok: boolean;
  error: string | null;
}

export interface createWorkaroundCommentMutation {
  createWorkaroundComment: createWorkaroundCommentMutation_createWorkaroundComment;
}

export interface createWorkaroundCommentMutationVariables {
  input: CreateWorkaroundCommentInput;
}
