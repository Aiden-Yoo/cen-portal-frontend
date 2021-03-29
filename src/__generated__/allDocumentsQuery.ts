/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllDocumentsInput, KindDocument } from "./globalTypes";

// ====================================================
// GraphQL query operation: allDocumentsQuery
// ====================================================

export interface allDocumentsQuery_allDocuments_documents_writer {
  __typename: "User";
  id: number;
  name: string;
  company: string;
}

export interface allDocumentsQuery_allDocuments_documents_files {
  __typename: "DocumentFiles";
  id: number;
  path: string;
}

export interface allDocumentsQuery_allDocuments_documents {
  __typename: "Documents";
  id: number;
  writer: allDocumentsQuery_allDocuments_documents_writer | null;
  locked: boolean | null;
  kind: KindDocument;
  title: string;
  files: allDocumentsQuery_allDocuments_documents_files[] | null;
  createAt: any;
  updateAt: any;
}

export interface allDocumentsQuery_allDocuments {
  __typename: "AllDocumentsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  documents: allDocumentsQuery_allDocuments_documents[] | null;
}

export interface allDocumentsQuery {
  allDocuments: allDocumentsQuery_allDocuments;
}

export interface allDocumentsQueryVariables {
  input: AllDocumentsInput;
}
