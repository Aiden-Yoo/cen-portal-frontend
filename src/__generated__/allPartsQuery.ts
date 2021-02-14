/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllPartsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: allPartsQuery
// ====================================================

export interface allPartsQuery_allParts_parts {
  __typename: "Part";
  id: number;
  name: string;
  series: string;
  description: string | null;
}

export interface allPartsQuery_allParts {
  __typename: "AllPartsOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  parts: allPartsQuery_allParts_parts[] | null;
}

export interface allPartsQuery {
  allParts: allPartsQuery_allParts;
}

export interface allPartsQueryVariables {
  input: AllPartsInput;
}
