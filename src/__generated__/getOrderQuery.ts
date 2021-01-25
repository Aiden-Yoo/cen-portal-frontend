/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetOrderInput, OrderClassification, DeliveryType, DeliveryMethod, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: getOrderQuery
// ====================================================

export interface getOrderQuery_getOrder_order_writer {
  __typename: "User";
  name: string;
}

export interface getOrderQuery_getOrder_order_partner {
  __typename: "Partner";
  name: string;
}

export interface getOrderQuery_getOrder_order_items_bundle {
  __typename: "Bundle";
  name: string;
}

export interface getOrderQuery_getOrder_order_items {
  __typename: "OrderItem";
  bundle: getOrderQuery_getOrder_order_items_bundle;
  num: number;
}

export interface getOrderQuery_getOrder_order {
  __typename: "Order";
  id: number;
  createAt: any;
  updateAt: any;
  writer: getOrderQuery_getOrder_order_writer | null;
  salesPerson: string;
  projectName: string;
  classification: OrderClassification;
  demoReturnDate: any | null;
  orderSheet: boolean;
  partner: getOrderQuery_getOrder_order_partner | null;
  destination: string;
  receiver: string;
  contact: string;
  address: string;
  deliveryDate: any;
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;
  remark: string | null;
  items: getOrderQuery_getOrder_order_items[];
  status: OrderStatus;
}

export interface getOrderQuery_getOrder {
  __typename: "GetOrderOutput";
  ok: boolean;
  error: string | null;
  order: getOrderQuery_getOrder_order | null;
}

export interface getOrderQuery {
  getOrder: getOrderQuery_getOrder;
}

export interface getOrderQueryVariables {
  input: GetOrderInput;
}
