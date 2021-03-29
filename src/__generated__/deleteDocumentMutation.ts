/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeleteDocumentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: deleteDocumentMutation
// ====================================================

export interface deleteDocumentMutation_deleteDocument {
  __typename: "DeleteDocumentOutput";
  ok: boolean;
  error: string | null;
}

export interface deleteDocumentMutation {
  deleteDocument: deleteDocumentMutation_deleteDocument;
}

export interface deleteDocumentMutationVariables {
  input: DeleteDocumentInput;
}
