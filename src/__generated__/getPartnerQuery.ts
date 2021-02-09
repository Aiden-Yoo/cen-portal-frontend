/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PartnerInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPartnerQuery
// ====================================================

export interface getPartnerQuery_findPartnerById_partner_contacts {
  __typename: "Contact";
  id: number;
  name: string;
  jobTitle: string | null;
  tel: string;
  team: string | null;
}

export interface getPartnerQuery_findPartnerById_partner_orders_items_bundle {
  __typename: "Bundle";
  name: string;
}

export interface getPartnerQuery_findPartnerById_partner_orders_items {
  __typename: "OrderItem";
  id: number;
  bundle: getPartnerQuery_findPartnerById_partner_orders_items_bundle;
  num: number;
}

export interface getPartnerQuery_findPartnerById_partner_orders {
  __typename: "Order";
  id: number;
  projectName: string;
  items: getPartnerQuery_findPartnerById_partner_orders_items[];
}

export interface getPartnerQuery_findPartnerById_partner {
  __typename: "Partner";
  id: number;
  name: string;
  address: string;
  zip: string | null;
  tel: string | null;
  contacts: getPartnerQuery_findPartnerById_partner_contacts[] | null;
  orders: getPartnerQuery_findPartnerById_partner_orders[] | null;
}

export interface getPartnerQuery_findPartnerById {
  __typename: "PartnerOutput";
  ok: boolean;
  error: string | null;
  partner: getPartnerQuery_findPartnerById_partner | null;
}

export interface getPartnerQuery {
  findPartnerById: getPartnerQuery_findPartnerById;
}

export interface getPartnerQueryVariables {
  input: PartnerInput;
}
