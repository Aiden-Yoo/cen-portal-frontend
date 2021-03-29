/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateDocumentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createDocumentMutation
// ====================================================

export interface createDocumentMutation_createDocument_document {
  __typename: "Documents";
  id: number;
}

export interface createDocumentMutation_createDocument {
  __typename: "CreateDocumentOutput";
  ok: boolean;
  error: string | null;
  document: createDocumentMutation_createDocument_document;
}

export interface createDocumentMutation {
  createDocument: createDocumentMutation_createDocument;
}

export interface createDocumentMutationVariables {
  input: CreateDocumentInput;
}
