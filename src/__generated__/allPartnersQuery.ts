/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllPartnersInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: allPartnersQuery
// ====================================================

export interface allPartnersQuery_allPartners_partners_contacts {
  __typename: "Contact";
  id: number;
  name: string;
  jobTitle: string | null;
  tel: string;
}

export interface allPartnersQuery_allPartners_partners {
  __typename: "Partner";
  id: number;
  name: string;
  address: string;
  zip: string | null;
  tel: string | null;
  contactsCount: number;
  contacts: allPartnersQuery_allPartners_partners_contacts[] | null;
}

export interface allPartnersQuery_allPartners {
  __typename: "AllPartnersOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  partners: allPartnersQuery_allPartners_partners[] | null;
}

export interface allPartnersQuery {
  allPartners: allPartnersQuery_allPartners;
}

export interface allPartnersQueryVariables {
  input: AllPartnersInput;
}
