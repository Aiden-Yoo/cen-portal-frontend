/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllWorkaroundsInput, KindWorkaround } from "./globalTypes";

// ====================================================
// GraphQL query operation: allWorkaroundsQuery
// ====================================================

export interface allWorkaroundsQuery_allWorkarounds_workarounds_writer {
  __typename: "User";
  id: number;
  name: string;
  company: string;
}

export interface allWorkaroundsQuery_allWorkarounds_workarounds_files {
  __typename: "WorkaroundFiles";
  id: number;
  path: string;
}

export interface allWorkaroundsQuery_allWorkarounds_workarounds {
  __typename: "Workarounds";
  id: number;
  writer: allWorkaroundsQuery_allWorkarounds_workarounds_writer | null;
  locked: boolean | null;
  kind: KindWorkaround;
  title: string;
  files: allWorkaroundsQuery_allWorkarounds_workarounds_files[] | null;
  createAt: any;
  updateAt: any;
  commentsNum: number;
}

export interface allWorkaroundsQuery_allWorkarounds {
  __typename: "AllWorkaroundsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  workarounds: allWorkaroundsQuery_allWorkarounds_workarounds[] | null;
}

export interface allWorkaroundsQuery {
  allWorkarounds: allWorkaroundsQuery_allWorkarounds;
}

export interface allWorkaroundsQueryVariables {
  input: AllWorkaroundsInput;
}
