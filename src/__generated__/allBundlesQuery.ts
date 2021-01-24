/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllBundlesInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: allBundlesQuery
// ====================================================

export interface allBundlesQuery_allBundles_bundles {
  __typename: "Bundle";
  id: number;
  name: string;
  series: string | null;
}

export interface allBundlesQuery_allBundles {
  __typename: "AllBundlesOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  bundles: allBundlesQuery_allBundles_bundles[] | null;
}

export interface allBundlesQuery {
  allBundles: allBundlesQuery_allBundles;
}

export interface allBundlesQueryVariables {
  input: AllBundlesInput;
}
