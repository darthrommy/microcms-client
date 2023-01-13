import {
  ClientEndpoints,
  MCContentId,
  MCContentStatus,
  MCImage,
  MCListItemBase,
  MCListResponseBase,
  MCMeta,
} from "./base";

/** `getListMeta` request type */
export type MCGetListMetaRequest<Endpoint extends ClientEndpoints> = {
  endpoint: Extract<keyof Endpoint["list"], string>;
  queries?: {
    limit?: number;
    offset?: number;
  };
};

/** `getListMeta` response type */
export type MCGetListMetaResponse = {
  contents: MCMeta[];
} & MCListResponseBase;

/** `getListItemMeta` request type */
export type MCGetListItemMetaRequest<Endpoint extends ClientEndpoints> = {
  endpoint: Extract<keyof Endpoint["list"], string>;
  contentId: string;
};

/** `getListItemMeta` response type */
export type MCGetListItemMetaResponse = MCMeta & MCListItemBase;

/** `getListObjectMeta` request type */
export type MCGetObjectMetaRequest<Endpoint extends ClientEndpoints> = {
  endpoint: Extract<keyof Endpoint["object"], string>;
};

/** `getListObjectMeta` response type */
export type MCGetObjectMetaResponse = MCMeta & MCContentId;

/** `updateStatus` request type */
export type MCUpdateStatusRequest<Endpoint extends ClientEndpoints> = {
  endpoint: Extract<keyof Endpoint["list"], string>;
  contentId: string;
  status: MCContentStatus;
};

export type MCSetObjectStatusRequest<Endpoint extends ClientEndpoints> = {
  endpoint: Extract<keyof Endpoint["object"], string>;
  status: MCContentStatus;
};

/** `getMedia` request type */
export type MCGetMediaQueries = {
  limit?: number;
  offset?: number;
  imageOnly?: true;
};

/** `getMedia` response type */
export type MCGetMediaResponse<Queries extends MCGetMediaQueries> = {
  media: (Queries extends { imageOnly: true }
    ? MCImage & MCContentId
    : unknown)[];
} & MCListResponseBase;
