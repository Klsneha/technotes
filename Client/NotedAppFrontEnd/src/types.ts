import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export enum Role {
  EMPLOYEE = "employee",
  ADMIN = "admin",
  MANAGER = "manager",
}

export interface User {
  id: string; // `id` is used by the adapter
  _id: string;
  userName: string;
  password: string;
  roles: Role[];
  active: Boolean;
  __v: number;
}

export interface Note {
  id: string; // `id` is used by the adapter
  _id: string;
  user: string;
  title: string;
  text: string;
  completed: boolean;
  ticket: Number;
  createdAt: string;
  updatedAt: string;
}

export interface Credentials {
  userName: string;
  password: string;
}

export type MutationError = FetchBaseQueryError | SerializedError | undefined;