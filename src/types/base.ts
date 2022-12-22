import { KV } from "./utils";

export type Fetch = typeof fetch;

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type DepthNumber = 1 | 2 | 3;

/** microCMS contentId */
export type MCContentId = {
  id: string;
};

/** microCMS content common date */
export type MCDate = {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  revisedAt?: string;
};

/** microCMS default list response type */
export type MCListItemBase = MCContentId & MCDate;

/** microCMS default object response type */
export type MCObjectBase = MCDate;

export type MCListResponseBase = {
  totalCount: number;
  limit: number;
  offset: number;
};

export type MCContentStatus = "DRAFT" | "PUBLISH" | "CLOSED";

export type MCCustomStatus = {
  key: string;
  description: string;
  name: string;
  behavior: MCContentStatus;
  color: string;
  createdAt: string;
  updatedAt: string;
};

/** microCMS management API response type */
export type MCMeta = {
  closedAt?: string;
  status: MCContentStatus[];
  customStatus?: MCCustomStatus[];
  draftKey?: string;
  createdBy: string;
  updatedBy: string;
  reservationTime?: {
    publishTime?: string;
    stopTime?: string;
  };
} & MCListItemBase;

/** microCMS image type */
export type MCImage = {
  url: string;
  width?: number;
  height?: number;
} & MCContentId;

/** An adapted relation fields. Use this when defining recursive fields. */
export type MCRelation<T> = T & MCListItemBase;

/** A template type to define types of each endpoints. See https://github.com/tsuki-lab/microcms-ts-sdk#type-safe-usage */
export type ClientEndpoints = {
  list?: KV;
  object?: KV;
};
