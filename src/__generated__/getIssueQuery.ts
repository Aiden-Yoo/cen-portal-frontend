/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetIssueInput, KindRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: getIssueQuery
// ====================================================

export interface getIssueQuery_getIssue_issue_writer {
  __typename: "User";
  id: number;
  company: string;
  name: string;
}

export interface getIssueQuery_getIssue_issue_files {
  __typename: "IssueFiles";
  id: number;
  path: string;
}

export interface getIssueQuery_getIssue_issue_comment_writer {
  __typename: "User";
  id: number;
  company: string;
  name: string;
}

export interface getIssueQuery_getIssue_issue_comment {
  __typename: "IssueComments";
  id: number;
  writer: getIssueQuery_getIssue_issue_comment_writer | null;
  comment: string;
  groupNum: number | null;
  depth: number;
  order: number;
  createAt: any;
  deleteAt: any | null;
}

export interface getIssueQuery_getIssue_issue {
  __typename: "Issues";
  id: number;
  title: string;
  kind: KindRole;
  content: string;
  locked: boolean | null;
  writer: getIssueQuery_getIssue_issue_writer | null;
  files: getIssueQuery_getIssue_issue_files[] | null;
  comment: getIssueQuery_getIssue_issue_comment[] | null;
}

export interface getIssueQuery_getIssue {
  __typename: "GetIssueOutput";
  ok: boolean;
  error: string | null;
  issue: getIssueQuery_getIssue_issue | null;
}

export interface getIssueQuery {
  getIssue: getIssueQuery_getIssue;
}

export interface getIssueQueryVariables {
  input: GetIssueInput;
}
