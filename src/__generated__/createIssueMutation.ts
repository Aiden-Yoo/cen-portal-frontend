/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateIssueInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createIssueMutation
// ====================================================

export interface createIssueMutation_createIssue_issue {
  __typename: "Issues";
  id: number;
}

export interface createIssueMutation_createIssue {
  __typename: "CreateIssueOutput";
  ok: boolean;
  error: string | null;
  issue: createIssueMutation_createIssue_issue;
}

export interface createIssueMutation {
  createIssue: createIssueMutation_createIssue;
}

export interface createIssueMutationVariables {
  input: CreateIssueInput;
}
