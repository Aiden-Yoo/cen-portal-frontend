/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllIssuesInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: allIssuesQuery
// ====================================================

export interface allIssuesQuery_allIssues_issues_writer {
  __typename: "User";
  id: number;
  name: string;
  company: string;
}

export interface allIssuesQuery_allIssues_issues_files {
  __typename: "IssueFiles";
  id: number;
  path: string;
}

export interface allIssuesQuery_allIssues_issues {
  __typename: "Issues";
  id: number;
  writer: allIssuesQuery_allIssues_issues_writer | null;
  locked: boolean | null;
  kind: string | null;
  title: string;
  files: allIssuesQuery_allIssues_issues_files[] | null;
  createAt: any;
  updateAt: any;
  commentsNum: number;
}

export interface allIssuesQuery_allIssues {
  __typename: "AllIssuesOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  issues: allIssuesQuery_allIssues_issues[] | null;
}

export interface allIssuesQuery {
  allIssues: allIssuesQuery_allIssues;
}

export interface allIssuesQueryVariables {
  input: AllIssuesInput;
}
