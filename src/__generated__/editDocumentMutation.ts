/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditDocumentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: editDocumentMutation
// ====================================================

export interface editDocumentMutation_editDocument {
  __typename: "EditDocumentOutput";
  ok: boolean;
  error: string | null;
}

export interface editDocumentMutation {
  editDocument: editDocumentMutation_editDocument;
}

export interface editDocumentMutationVariables {
  input: EditDocumentInput;
}
