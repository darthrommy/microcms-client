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
export type MCListBase = MCContentId & MCDate;

/** microCMS default object response type */
export type MCObjectBase = MCDate;

/** An adapted relation fields. Use this when defining recursive fields. */
export type MCRelation<T> = T & MCListBase;
