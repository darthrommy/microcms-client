import {
  ClientEndpoints,
  MCContentStatus,
  MCImage,
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
export type MCGetListItemMetaResponse = MCMeta;

/** `getListObjectMeta` request type */
export type MCGetObjectMetaRequest<Endpoint extends ClientEndpoints> = {
  endpoint: Extract<keyof Endpoint["object"], string>;
};

/** `getListObjectMeta` response type */
export type MCGetObjectMetaResponse = MCMeta;

/** `updateStatus` request type */
export type MCUpdateStatusRequest<Endpoint extends ClientEndpoints> = {
  endpoint: Extract<keyof Endpoint["list"], string>;
  contentId: string;
  status: MCContentStatus;
};

/** `getMedia` request type */
export type MCGetMediaRequest = {
  quries?: {
    limit?: number;
    offset?: number;
    imageOnly?: true;
  };
};

/** `getMedia` response type */
export type MCGetMediaResponse<Request extends MCGetMediaRequest> = {
  media: (Request extends { queries: { imageOnly: true } }
    ? MCImage
    : MCImage | unknown)[];
} & MCListResponseBase;
