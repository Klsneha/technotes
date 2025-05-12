// import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MutationError } from "../types";
import { SerializedError } from "@reduxjs/toolkit";

export const getError = (error: MutationError): string => {
  if (error) {
    if ("status" in error) {
      // It's a FetchBaseQueryError (API error)
      return (error as any)?.data?.message as string ?? "error"
    } else {
      // It's a SerializedError (internal error)
      return (error as SerializedError).message as string ?? "An unknown error occurred";
    }
  }
  return "";
}

export const USER_REGEX = /^[A-z]{3,20}$/
export const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
export const NOTE_TITLE_REGEX = /^[\w\s.,!?'"@#%&()\-:;]{3,50}$/;
export const NOTE_TEXT_REGEX = /^[\w\s.,!?'"@#%&()\-:;]{0,100}$/;