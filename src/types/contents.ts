import {
  ClientEndpoints,
  DepthNumber,
  MCContentId,
  MCListItemBase,
  MCListResponseBase,
  MCObjectBase,
  MCRelation,
} from "./base";
import { DecrementNum } from "./utils";

export type ResolveUpsertRelation<T> = {
  [K in keyof T]: T[K] extends infer Props
    ? Props extends MCRelation<unknown>
      ? string
      : Props extends MCRelation<unknown>[]
      ? string[]
      : Props
    : never;
};

/** `create` request type */
export interface MCCreateRequest<Endpoint extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoint["list"], string>;
  contentId?: string;
  content: ResolveUpsertRelation<Endpoint["list"][this["endpoint"]]>;
  isDraft?: true;
}

/** `update` list request type */
export interface MCUpdateListRequest<Endpoint extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoint["list"], string>;
  contentId: string;
  content: Partial<Endpoint["list"][this["endpoint"]]>;
}

/** `udpate` object request type */
export interface MCUpdateObjectRequest<Endpoint extends ClientEndpoints> {
  endpoint: Extract<keyof Endpoint["object"], string>;
  content: Partial<Endpoint["object"][this["endpoint"]]>;
}

/** `delete` request type */
export type MCDeleteRequest<Endpoints extends ClientEndpoints> = {
  endpoint: Extract<keyof Endpoints["list"], string>;
  contentId: string;
};

export type WriteResponse = {
  id: string;
};

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
    (Kind extends "list" ? MCListItemBase : MCObjectBase)
> = Request extends {
  queries: {
    fields: (infer Fields extends keyof ContentType)[];
  };
}
  ? ResolveDepthQuery<Request, Pick<ContentType, Fields>>
  : ResolveDepthQuery<Request, ContentType>;

/** `getList` queries type */
export type MCGetListQueries<E> = {
  draftKey?: string;
  limit?: number;
  offset?: number;
  orders?: string;
  fields?: Extract<keyof E | keyof MCListItemBase, string>[];
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
export type MCGetListResponse<
  Endpoints extends ClientEndpoints,
  Request extends MCGetListRequest<Endpoints>
> = {
  contents: ResolveContentType<Endpoints, "list", Request>[];
} & MCListResponseBase;

/** `getListItem` queries type */
export type MCGetListItemQueries<ContentType> = {
  draftKey?: string;
  fields?: Extract<keyof ContentType | keyof MCListItemBase, string>[];
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
