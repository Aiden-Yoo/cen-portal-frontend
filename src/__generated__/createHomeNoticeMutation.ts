/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateHomeNoticeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createHomeNoticeMutation
// ====================================================

export interface createHomeNoticeMutation_createHomeNotice {
  __typename: "CreateHomeNoticeOutput";
  ok: boolean;
  error: string | null;
}

export interface createHomeNoticeMutation {
  createHomeNotice: createHomeNoticeMutation_createHomeNotice;
}

export interface createHomeNoticeMutationVariables {
  input: CreateHomeNoticeInput;
}
