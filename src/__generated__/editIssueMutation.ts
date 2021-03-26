/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditIssueInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editIssueMutation
// ====================================================

export interface editIssueMutation_editIssue {
  __typename: "EditIssueOutput";
  ok: boolean;
  error: string | null;
}

export interface editIssueMutation {
  editIssue: editIssueMutation_editIssue;
}

export interface editIssueMutationVariables {
  input: EditIssueInput;
}
