/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetDocumentInput, KindDocument } from "./globalTypes";

// ====================================================
// GraphQL query operation: getDocumentQuery
// ====================================================

export interface getDocumentQuery_getDocument_document_writer {
  __typename: "User";
  id: number;
  company: string;
  name: string;
}

export interface getDocumentQuery_getDocument_document_files {
  __typename: "DocumentFiles";
  id: number;
  path: string;
}

export interface getDocumentQuery_getDocument_document {
  __typename: "Documents";
  id: number;
  title: string;
  kind: KindDocument;
  content: string;
  locked: boolean | null;
  writer: getDocumentQuery_getDocument_document_writer | null;
  files: getDocumentQuery_getDocument_document_files[] | null;
}

export interface getDocumentQuery_getDocument {
  __typename: "GetDocumentOutput";
  ok: boolean;
  error: string | null;
  document: getDocumentQuery_getDocument_document | null;
}

export interface getDocumentQuery {
  getDocument: getDocumentQuery_getDocument;
}

export interface getDocumentQueryVariables {
  input: GetDocumentInput;
}
