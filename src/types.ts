import { DecrementNum, Fetch, KV } from "./type-utils";

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

// ! WRITE APIS

export type ResolveUpsertRelation<T> = {
  [K in keyof T]: T[K] extends infer Props
    ? Props extends MCRelation<unknown>
      ? string
      : Props extends MCRelation<unknown>[]
      ? string[]
      : Props
    : never;
};

// * CREATE API

/** `create` request type */
export interface CreateRequest<Endpoint extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoint["list"], string>;
  contentId?: string;
  content: ResolveUpsertRelation<Endpoint["list"][this["endpoint"]]>;
  isDraft?: boolean;
}

// * UPDATE LIST API

/** `update` list request type */
export interface UpdateListRequest<Endpoint extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoint["list"], string>;
  contentId: string;
  content: Partial<Endpoint["list"][this["endpoint"]]>;
}

// * UPDATE OBJECT API

/** `udpate` object request type */
export interface UpdateObjectRequest<Endpoint extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoint["list"], string>;
  contentId: string;
  content: Partial<Endpoint["object"][this["endpoint"]]>;
}

/** `update` request type */
export type UpdateRequest<Endpoint extends ClientEndpoints> =
  | UpdateListRequest<Endpoint>
  | UpdateObjectRequest<Endpoint>;

// * DELETE API

/** `delete` request type */
export type DeleteRequest<Endpoints extends ClientEndpoints> = {
  endpoint: Extract<
    keyof Endpoints["list"] | keyof Endpoints["object"],
    string
  >;
  contentId: string;
};

export type WriteResponse = {
  id: string;
};

// ! GET APIS

export type ResolveDepthResponse<ContentType, Depth extends number = 1> = {
  [K in keyof ContentType]: ContentType[K] extends infer Props
    ? Props extends MCRelation<infer Child>
      ? Depth extends 0
        ? MCContentId
        : ResolveDepthResponse<Child, DecrementNum<Depth>>
      : Props extends MCRelation<infer Child>[]
      ? Depth extends 0
        ? MCContentId[]
        : ResolveDepthResponse<Child, DecrementNum<Depth>>[]
      : Props
    : never;
};

export type ResolveDepthQuery<Request, Content> = Request extends {
  queries: {
    depth: infer Depth extends DepthNumber;
  };
}
  ? ResolveDepthResponse<Content, Depth>
  : ResolveDepthResponse<Content>;

export type ResolveContentType<
  Endpoints extends ClientEndpoints,
  Kind extends keyof ClientEndpoints,
  Request extends { endpoint: keyof Endpoints[Kind] },
  ContentType = Endpoints[Kind][Request["endpoint"]] &
    (Kind extends "list" ? MCListBase : MCObjectBase)
> = Request extends {
  queries: {
    fields: (infer Fields extends keyof ContentType)[];
  };
}
  ? ResolveDepthQuery<Request, Pick<ContentType, Fields>>
  : ResolveDepthQuery<Request, ContentType>;

// * GET LIST API

/** `getList` queries type */
export type MCGetListQueries<E> = {
  draftKey?: string;
  limit?: number;
  offset?: number;
  orders?: string;
  fields?: Extract<keyof E | keyof MCListBase, string>[];
  q?: string;
  depth?: DepthNumber;
  ids?: string | string[];
  filters?: string;
  richEditorFormat?: "html" | "object";
};

/** `getList` request type */
export interface MCGetListRequest<Endpoints extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoints["list"], string>;
  queries?: MCGetListQueries<Endpoints["list"][this["endpoint"]]>;
}

/** `getList` response type */
export interface MCGetListResponse<
  Endpoints extends ClientEndpoints,
  Request extends MCGetListRequest<Endpoints>
> {
  contents: ResolveContentType<Endpoints, "list", Request>[];
  totalCount: number;
  limit: number;
  offset: number;
}

// * GET LIST ITEM API

/** `getListItem` queries type */
export type MCGetListItemQueries<ContentType> = {
  draftKey?: string;
  fields?: Extract<keyof ContentType | keyof MCListBase, string>[];
  depth?: DepthNumber;
  richEditorFormat?: "html" | "object";
};

/** `getListItem` request type */
export interface MCGetListItemRequest<Endpoints extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoints["list"], string>;
  contentId: string;
  queries?: MCGetListItemQueries<Endpoints["list"][this["endpoint"]]>;
}

/** `getListItem` response type */
export type MCGetListItemResponse<
  Endpoints extends ClientEndpoints,
  Request extends MCGetListItemRequest<Endpoints>
> = ResolveContentType<Endpoints, "list", Request>;

// * GET OBJECT API

/** `getObject` queries type */
export type MCGetObjectQueries<ContentType> = {
  draftKey?: string;
  fields?: Extract<keyof ContentType | keyof MCObjectBase, string>[];
  depth?: DepthNumber;
  richEditorFormat?: "html" | "object";
};

/** `getObject` request type */
export interface MCGetObjectRequest<Endpoints extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoints["object"], string>;
  queries?: MCGetObjectQueries<Endpoints["object"][this["endpoint"]]>;
}

/** `getObject` response type. */
export type MCGetObjectResponse<
  Endpoints extends ClientEndpoints,
  Request extends MCGetObjectRequest<Endpoints>
> = ResolveContentType<Endpoints, "object", Request>;

// ! CLIENT

/** A template type to define types of each endpoints. See https://github.com/tsuki-lab/microcms-ts-sdk#type-safe-usage */
export type ClientEndpoints = {
  list?: KV;
  object?: KV;
};

/** a `createClient` type */
export type MCClient = <Endpoints extends ClientEndpoints>(args: {
  serviceDomain: string;
  apiKey: string;
  customFetch?: Fetch;
}) => {
  getList: <Request extends MCGetListRequest<Endpoints>>(
    request: Request
  ) => Promise<MCGetListResponse<Endpoints, Request>>;
  getListItem: <Request extends MCGetListItemRequest<Endpoints>>(
    request: Request
  ) => Promise<MCGetListItemResponse<Endpoints, Request>>;
  getObject: <Request extends MCGetObjectRequest<Endpoints>>(
    request: Request
  ) => Promise<MCGetObjectResponse<Endpoints, Request>>;
  create: <T extends KV>(request: CreateRequest<T>) => Promise<WriteResponse>;
  update: <T extends KV>(request: UpdateRequest<T>) => Promise<WriteResponse>;
  delete: <Request extends DeleteRequest<Endpoints>>(
    request: Request
  ) => Promise<void>;
};
