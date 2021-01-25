/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrdersInput, OrderClassification, DeliveryType, DeliveryMethod, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: getOrdersQuery
// ====================================================

export interface getOrdersQuery_getOrders_orders_partner {
  __typename: "Partner";
  name: string;
}

export interface getOrdersQuery_getOrders_orders {
  __typename: "Order";
  id: number;
  createAt: any;
  salesPerson: string;
  classification: OrderClassification;
  projectName: string;
  partner: getOrdersQuery_getOrders_orders_partner | null;
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;
  deliveryDate: any;
  status: OrderStatus;
}

export interface getOrdersQuery_getOrders {
  __typename: "GetOrdersOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  orders: getOrdersQuery_getOrders_orders[] | null;
}

export interface getOrdersQuery {
  getOrders: getOrdersQuery_getOrders;
}

export interface getOrdersQueryVariables {
  input: GetOrdersInput;
}
