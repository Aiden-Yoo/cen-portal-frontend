/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum DeliveryMethod {
  Cargo = 'Cargo',
  Directly = 'Directly',
  Parcel = 'Parcel',
  Quick = 'Quick',
}

export enum DeliveryType {
  Partial = 'Partial',
  Total = 'Total',
}

export enum KindDocument {
  Brochure = 'Brochure',
  Certificate = 'Certificate',
  Datasheet = 'Datasheet',
  ETC = 'ETC',
  Proposal = 'Proposal',
  TestReport = 'TestReport',
}

export enum KindFirmware {
  C2000 = 'C2000',
  C3000 = 'C3000',
  C3100 = 'C3100',
  C3300 = 'C3300',
  C5000 = 'C5000',
  C7000 = 'C7000',
  C9000 = 'C9000',
  ETC = 'ETC',
}

export enum KindRole {
  Case = 'Case',
  ETC = 'ETC',
  Question = 'Question',
}

export enum KindWorkaround {
  C2000 = 'C2000',
  C3000 = 'C3000',
  C3100 = 'C3100',
  C3300 = 'C3300',
  C5000 = 'C5000',
  C7000 = 'C7000',
  C9000 = 'C9000',
  ETC = 'ETC',
}

export enum OrderClassification {
  Demo = 'Demo',
  DoA = 'DoA',
  RMA = 'RMA',
  Sale = 'Sale',
}

export enum OrderStatus {
  Canceled = 'Canceled',
  Completed = 'Completed',
  Created = 'Created',
  Notcompleted = 'Notcompleted',
  Partial = 'Partial',
  Pending = 'Pending',
  Preparing = 'Preparing',
}

export enum UserRole {
  CEN = 'CEN',
  CENSE = 'CENSE',
  Client = 'Client',
  Distributor = 'Distributor',
  Partner = 'Partner',
}

export interface AllBundlesInput {
  page?: number | null;
  take?: number | null;
}

export interface AllDocumentsInput {
  page?: number | null;
  take?: number | null;
}

export interface AllFirmwaresInput {
  page?: number | null;
  take?: number | null;
}

export interface AllIssuesInput {
  page?: number | null;
  take?: number | null;
}

export interface AllPartnersInput {
  page?: number | null;
  take?: number | null;
}

export interface AllPartsInput {
  page?: number | null;
  take?: number | null;
}

export interface AllUsersInput {
  page?: number | null;
  take?: number | null;
}

export interface AllWorkaroundsInput {
  page?: number | null;
  take?: number | null;
}

export interface BundleInput {
  bundleId: number;
}

export interface BundleInputType {
  name: string;
  series?: string | null;
  parts?: BundleItemInputType[] | null;
  description?: string | null;
  orderItem?: OrderItemInputType | null;
}

export interface BundleItemInputType {
  part: PartInputType;
  num?: number | null;
  bundle?: BundleInputType | null;
}

export interface ContactInputType {
  name: string;
  team?: string | null;
  jobTitle?: string | null;
  tel: string;
  partner: PartnerInputType;
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
  description?: string | null;
  parts: CreateBundleItemInput[];
}

export interface CreateBundleItemInput {
  partId: number;
  num?: number | null;
}

export interface CreateContactInput {
  name: string;
  team?: string | null;
  jobTitle?: string | null;
  tel: string;
  partnerId: number;
}

export interface CreateDocumentInput {
  locked?: boolean | null;
  kind: KindDocument;
  title: string;
  content: string;
  files?: DocumentFilesInputType[] | null;
}

export interface CreateFirmwareInput {
  locked?: boolean | null;
  kind: KindFirmware;
  title: string;
  content: string;
  files?: FirmwareFilesInputType[] | null;
}

export interface CreateHomeNoticeInput {
  content: string;
}

export interface CreateIssueCommentInput {
  comment?: string | null;
  depth?: number | null;
  order?: number | null;
  groupNum?: number | null;
  issueId: number;
}

export interface CreateIssueInput {
  locked?: boolean | null;
  kind: KindRole;
  title: string;
  content: string;
  files?: IssueFilesInputType[] | null;
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

export interface CreatePartInput {
  name: string;
  series: string;
  description?: string | null;
}

export interface CreatePartnerInput {
  name: string;
  address: string;
  zip?: string | null;
  tel?: string | null;
}

export interface CreateWorkaroundCommentInput {
  comment?: string | null;
  depth?: number | null;
  order?: number | null;
  groupNum?: number | null;
  workaroundId: number;
}

export interface CreateWorkaroundInput {
  locked?: boolean | null;
  kind: KindWorkaround;
  title: string;
  content: string;
  files?: WorkaroundFilesInputType[] | null;
}

export interface DeleteBundleInput {
  bundleId: number;
}

export interface DeleteContactInput {
  contactId: number;
}

export interface DeleteDocumentInput {
  documentId: number;
}

export interface DeleteFirmwareInput {
  firmwareId: number;
}

export interface DeleteIssueCommentInput {
  commentId: number;
}

export interface DeleteIssueInput {
  issueId: number;
}

export interface DeleteOrderInput {
  orderId: number;
}

export interface DeletePartInput {
  partId: number;
}

export interface DeletePartnerInput {
  partnerId: number;
}

export interface DeleteWorkaroundCommentInput {
  commentId: number;
}

export interface DeleteWorkaroundInput {
  workaroundId: number;
}

export interface DocumentFilesInputType {
  path: string;
  document?: DocumentsInputType | null;
}

export interface DocumentsInputType {
  writer?: UserInputType | null;
  locked?: boolean | null;
  kind: KindDocument;
  title: string;
  content: string;
  files?: DocumentFilesInputType[] | null;
  deleteAt?: any | null;
}

export interface EditBundleInput {
  name?: string | null;
  series?: string | null;
  description?: string | null;
  parts?: CreateBundleItemInput[] | null;
  bundleId: number;
}

export interface EditContactInput {
  name?: string | null;
  team?: string | null;
  jobTitle?: string | null;
  tel?: string | null;
  contactId: number;
}

export interface EditDocumentInput {
  locked?: boolean | null;
  kind?: KindDocument | null;
  title?: string | null;
  content?: string | null;
  files?: DocumentFilesInputType[] | null;
  documentId: number;
}

export interface EditFirmwareInput {
  locked?: boolean | null;
  kind?: KindFirmware | null;
  title?: string | null;
  content?: string | null;
  files?: FirmwareFilesInputType[] | null;
  firmwareId: number;
}

export interface EditIssueInput {
  locked?: boolean | null;
  kind?: KindRole | null;
  title?: string | null;
  content?: string | null;
  files?: IssueFilesInputType[] | null;
  issueId: number;
}

export interface EditItemInfoInput {
  serialNumber?: string | null;
  itemInfoId: number;
}

export interface EditOrderInput {
  id: number;
  status: OrderStatus;
}

export interface EditPartInput {
  name?: string | null;
  series?: string | null;
  description?: string | null;
  partId: number;
}

export interface EditPartnerInput {
  name?: string | null;
  address?: string | null;
  zip?: string | null;
  tel?: string | null;
  partnerId: number;
}

export interface EditProfileInput {
  password?: string | null;
  team?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
}

export interface EditUserInput {
  role?: UserRole | null;
  verified?: boolean | null;
  isLocked?: boolean | null;
  orderAuth?: boolean | null;
  userId: number;
}

export interface EditWorkaroundInput {
  locked?: boolean | null;
  kind?: KindWorkaround | null;
  title?: string | null;
  content?: string | null;
  files?: WorkaroundFilesInputType[] | null;
  workaroundId: number;
}

export interface FirmwareFilesInputType {
  path: string;
  firmware?: FirmwaresInputType | null;
}

export interface FirmwaresInputType {
  writer?: UserInputType | null;
  locked?: boolean | null;
  kind: KindFirmware;
  title: string;
  content: string;
  files?: FirmwareFilesInputType[] | null;
  deleteAt?: any | null;
}

export interface GetDocumentInput {
  id: number;
}

export interface GetFirmwareInput {
  id: number;
}

export interface GetIssueInput {
  id: number;
}

export interface GetOrderInput {
  id: number;
}

export interface GetOrderItemsInput {
  page?: number | null;
  take?: number | null;
  orderId: number;
}

export interface GetOrdersInput {
  page?: number | null;
  take?: number | null;
  status?: OrderStatus | null;
  classification?: OrderClassification | null;
}

export interface GetWorkaroundInput {
  id: number;
}

export interface IssueCommentsInputType {
  writer?: UserInputType | null;
  comment: string;
  post: IssuesInputType;
  depth: number;
  order: number;
  groupNum?: number | null;
  deleteAt?: any | null;
}

export interface IssueFilesInputType {
  path: string;
  issue?: IssuesInputType | null;
}

export interface IssuesInputType {
  writer?: UserInputType | null;
  locked?: boolean | null;
  kind: KindRole;
  title: string;
  content: string;
  files?: IssueFilesInputType[] | null;
  comment?: IssueCommentsInputType[] | null;
  deleteAt?: any | null;
}

export interface ItemInfoInputType {
  name: string;
  serialNumber?: string | null;
  order: OrderInputType;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface OrderInputType {
  writer?: UserInputType | null;
  salesPerson: string;
  projectName: string;
  classification: OrderClassification;
  demoReturnDate?: any | null;
  orderSheet: boolean;
  partner?: PartnerInputType | null;
  destination: string;
  receiver: string;
  contact: string;
  address: string;
  deliveryDate: any;
  deliveryType: DeliveryType;
  deliveryMethod: DeliveryMethod;
  remark?: string | null;
  itemInfos?: ItemInfoInputType[] | null;
  items: OrderItemInputType[];
  status: OrderStatus;
}

export interface OrderItemInputType {
  bundle?: BundleInputType | null;
  num: number;
  order: OrderInputType;
}

export interface PartInput {
  partId: number;
}

export interface PartInputType {
  name: string;
  series: string;
  description?: string | null;
}

export interface PartnerInput {
  partnerId: number;
}

export interface PartnerInputType {
  name: string;
  address: string;
  zip?: string | null;
  tel?: string | null;
  contacts?: ContactInputType[] | null;
  orders?: OrderInputType[] | null;
}

export interface UserInputType {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  company: string;
  team?: string | null;
  jobTitle?: string | null;
  bio?: string | null;
  verified: boolean;
  isLocked: boolean;
  orderAuth: boolean;
  orders: OrderInputType[];
}

export interface VerifyEmailInput {
  code: string;
}

export interface WorkaroundCommentsInputType {
  writer?: UserInputType | null;
  comment: string;
  post: WorkaroundsInputType;
  depth: number;
  order: number;
  groupNum?: number | null;
  deleteAt?: any | null;
}

export interface WorkaroundFilesInputType {
  path: string;
  workaround?: WorkaroundsInputType | null;
}

export interface WorkaroundsInputType {
  writer?: UserInputType | null;
  locked?: boolean | null;
  kind: KindWorkaround;
  title: string;
  content: string;
  files?: WorkaroundFilesInputType[] | null;
  comment?: WorkaroundCommentsInputType[] | null;
  deleteAt?: any | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
