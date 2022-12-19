import { Fetch, KV } from "./type-utils";

export type DepthNumber = 1 | 2 | 3;

/**
 * microCMS queries
 */
export interface MCQueries<T extends KV> {
  draftKey?: string;
  limit?: number;
  offset?: number;
  orders?: string;
  fields?: Extract<keyof T, string>[];
  q?: string;
  depth?: DepthNumber;
  ids?: string | string[];
  filters?: string;
  richEditorFormat?: "html" | "object";
}

/**
 * microCMS contentId
 */
export type MCContentId = {
  id: string;
};

/**
 * microCMS content common date
 */
export type MCDate = {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  revisedAt?: string;
};

export type MCListBase = MCContentId & MCDate;

export type MCObjectBase = MCDate;

/* ---------------------------------------------- */

export type MCClient = (args: {
  serviceDomain: string;
  apiKey: string;
  customFetch?: Fetch;
}) => {
  getList: <T extends KV>(
    request: GetListRequest<T>
  ) => Promise<MCListResponse<T>>;
  getListItem: <T extends KV>(
    request: GetListItemRequest<T>
  ) => Promise<T & MCListBase>;
  getObject: <T extends KV>(
    request: GetObjectRequest<T>
  ) => Promise<T & MCListBase>;
  create: <T extends KV>(request: CreateRequest<T>) => Promise<WriteResponse>;
  update: <T extends KV>(request: UpdateRequest<T>) => Promise<WriteResponse>;
  delete: (request: DeleteRequest) => Promise<void>;
};

export type MCListResponse<T extends KV> = {
  contents: (T & MCContentId)[];
  totalCount: number;
  limit: number;
  offset: number;
};

export type GetListRequest<T extends KV> = {
  endpoint: string;
  queries?: MCQueries<T & MCListBase>;
};

export type GetListItemRequest<T extends KV> = {
  endpoint: string;
  contentId: string;
  queries?: MCQueries<T & MCListBase>;
};

export type GetObjectRequest<T extends KV> = {
  endpoint: string;
  queries?: MCQueries<T>;
};

export type WriteResponse = {
  id: string;
};

export type CreateRequest<T extends KV> = {
  endpoint: string;
  contentId?: string;
  content: T;
  isDraft?: boolean;
};

export type UpdateRequest<T extends KV> = {
  endpoint: string;
  contentId: string;
  content: Partial<T>;
};

export type DeleteRequest = {
  endpoint: string;
  contentId: string;
};
