/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetWorkaroundInput, KindWorkaround } from "./globalTypes";

// ====================================================
// GraphQL query operation: getWorkaroundQuery
// ====================================================

export interface getWorkaroundQuery_getWorkaround_workaround_writer {
  __typename: "User";
  id: number;
  company: string;
  name: string;
}

export interface getWorkaroundQuery_getWorkaround_workaround_files {
  __typename: "WorkaroundFiles";
  id: number;
  path: string;
}

export interface getWorkaroundQuery_getWorkaround_workaround_comment_writer {
  __typename: "User";
  id: number;
  company: string;
  name: string;
}

export interface getWorkaroundQuery_getWorkaround_workaround_comment {
  __typename: "WorkaroundComments";
  id: number;
  writer: getWorkaroundQuery_getWorkaround_workaround_comment_writer | null;
  comment: string;
  groupNum: number | null;
  depth: number;
  order: number;
  createAt: any;
  deleteAt: any | null;
}

export interface getWorkaroundQuery_getWorkaround_workaround {
  __typename: "Workarounds";
  id: number;
  title: string;
  kind: KindWorkaround;
  content: string;
  locked: boolean | null;
  writer: getWorkaroundQuery_getWorkaround_workaround_writer | null;
  files: getWorkaroundQuery_getWorkaround_workaround_files[] | null;
  comment: getWorkaroundQuery_getWorkaround_workaround_comment[] | null;
}

export interface getWorkaroundQuery_getWorkaround {
  __typename: "GetWorkaroundOutput";
  ok: boolean;
  error: string | null;
  workaround: getWorkaroundQuery_getWorkaround_workaround | null;
}

export interface getWorkaroundQuery {
  getWorkaround: getWorkaroundQuery_getWorkaround;
}

export interface getWorkaroundQueryVariables {
  input: GetWorkaroundInput;
}
