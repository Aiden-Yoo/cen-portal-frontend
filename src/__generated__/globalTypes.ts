/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum DeliveryMethod {
  Cargo = "Cargo",
  Directly = "Directly",
  Parcel = "Parcel",
  Quick = "Quick",
}

export enum DeliveryType {
  Partial = "Partial",
  Total = "Total",
}

export enum OrderClassification {
  Demo = "Demo",
  DoA = "DoA",
  RMA = "RMA",
  Sale = "Sale",
}

export enum OrderStatus {
  Canceled = "Canceled",
  Completed = "Completed",
  Created = "Created",
  Partial = "Partial",
  Pending = "Pending",
  Preparing = "Preparing",
}

export enum UserRole {
  CEN = "CEN",
  CENSE = "CENSE",
  Client = "Client",
  Distributor = "Distributor",
  Partner = "Partner",
}

export interface AllBundlesInput {
  page?: number | null;
  take?: number | null;
}

export interface AllPartnersInput {
  page?: number | null;
  take?: number | null;
}

export interface BundleInputType {
  name: string;
  series?: string | null;
  parts?: PartInputType[] | null;
  orderItem?: OrderItemInputType | null;
}

export interface CreateAccountInput {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  company: string;
  team?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
}

export interface CreateBundleInput {
  name: string;
  series?: string | null;
  parts?: PartInputType[] | null;
}

export interface CreateContactInput {
  name: string;
  team?: string | null;
  jobTitle?: string | null;
  tel: string;
  partnerId: number;
}

export interface CreateOrderInput {
  salesPerson: string;
  projectName: string;
  classification: OrderClassification;
  demoReturnDate?: any | null;
  orderSheet: boolean;
  destination: string;
  receiver: string;
  contact: string;
  address: string;
  deliveryDate: any;
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;
  remark?: string | null;
  status: OrderStatus;
  partnerId: number;
  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  bundleId: number;
  num: number;
}

export interface CreatePartnerInput {
  name: string;
  address: string;
  zip?: string | null;
  tel?: string | null;
}

export interface DeleteBundleInput {
  bundleId: number;
}

export interface DeleteContactInput {
  contactId: number;
}

export interface DeleteOrderInput {
  orderId: number;
}

export interface DeletePartnerInput {
  partnerId: number;
}

export interface EditContactInput {
  name?: string | null;
  team?: string | null;
  jobTitle?: string | null;
  tel?: string | null;
  contactId: number;
}

export interface EditOrderInput {
  id: number;
  status: OrderStatus;
}

export interface EditPartnerInput {
  name?: string | null;
  address?: string | null;
  zip?: string | null;
  tel?: string | null;
  partnerId: number;
}

export interface GetOrderInput {
  id: number;
}

export interface GetOrdersInput {
  page?: number | null;
  take?: number | null;
  status?: OrderStatus | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface OrderItemInputType {
  bundle: BundleInputType;
  num: number;
}

export interface PartInputType {
  name: string;
  num?: number | null;
  description?: string | null;
  bundle?: BundleInputType | null;
}

export interface PartnerInput {
  partnerId: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
