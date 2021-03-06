/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getHomeNoticeQuery
// ====================================================

export interface getHomeNoticeQuery_getHomeNotice_notice {
  __typename: "HomeNotice";
  id: number;
  content: string;
}

export interface getHomeNoticeQuery_getHomeNotice {
  __typename: "GetHomeNoticeOutput";
  ok: boolean;
  error: string | null;
  notice: getHomeNoticeQuery_getHomeNotice_notice | null;
}

export interface getHomeNoticeQuery {
  getHomeNotice: getHomeNoticeQuery_getHomeNotice;
}
