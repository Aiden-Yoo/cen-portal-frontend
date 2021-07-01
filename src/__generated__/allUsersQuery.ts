/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AllUsersInput, UserRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: allUsersQuery
// ====================================================

export interface allUsersQuery_allUsers_users {
  __typename: "User";
  id: number;
  createAt: any;
  email: string;
  role: UserRole;
  company: string;
  team: string | null;
  name: string;
  verified: boolean;
  isLocked: boolean;
}

export interface allUsersQuery_allUsers {
  __typename: "AllUsersOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalResults: number | null;
  users: allUsersQuery_allUsers_users[] | null;
}

export interface allUsersQuery {
  allUsers: allUsersQuery_allUsers;
}

export interface allUsersQueryVariables {
  input: AllUsersInput;
}
