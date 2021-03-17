/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteIssueInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteIssueMutation
// ====================================================

export interface deleteIssueMutation_deleteIssue {
  __typename: "DeleteIssueOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteIssueMutation {
  deleteIssue: deleteIssueMutation_deleteIssue;
}

export interface deleteIssueMutationVariables {
  input: DeleteIssueInput;
}
