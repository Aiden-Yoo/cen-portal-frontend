/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PartInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPartQuery
// ====================================================

export interface getPartQuery_findPartById_part {
  __typename: "Part";
  id: number;
  name: string;
  series: string;
  description: string | null;
}

export interface getPartQuery_findPartById {
  __typename: "PartOutput";
  ok: boolean;
  error: string | null;
  part: getPartQuery_findPartById_part | null;
}

export interface getPartQuery {
  findPartById: getPartQuery_findPartById;
}

export interface getPartQueryVariables {
  input: PartInput;
}
