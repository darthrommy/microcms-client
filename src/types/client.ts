import { ClientEndpoints, Fetch } from "./base";
import {
  MCCreateRequest,
  MCDeleteRequest,
  MCGetListItemRequest,
  MCGetListItemResponse,
  MCGetListRequest,
  MCGetListResponse,
  MCGetObjectRequest,
  MCGetObjectResponse,
  MCUpdateRequest,
  WriteResponse,
} from "./contents";
import {
  MCGetListItemMetaRequest,
  MCGetListItemMetaResponse,
  MCGetListMetaRequest,
  MCGetListMetaResponse,
  MCGetMediaRequest,
  MCGetMediaResponse,
  MCGetObjectMetaRequest,
  MCGetObjectMetaResponse,
  MCUpdateStatusRequest,
} from "./management";

/** `createClient` type */
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

  create: <Request extends MCCreateRequest<Endpoints>>(
    request: Request
  ) => Promise<WriteResponse>;

  update: <Request extends MCUpdateRequest<Endpoints>>(
    request: Request
  ) => Promise<WriteResponse>;

  delete: <Request extends MCDeleteRequest<Endpoints>>(
    request: Request
  ) => Promise<void>;

  unstable_getListMeta: <Request extends MCGetListMetaRequest<Endpoints>>(
    request: Request
  ) => Promise<MCGetListMetaResponse>;

  unstable_getListItemMeta: <
    Request extends MCGetListItemMetaRequest<Endpoints>
  >(
    request: Request
  ) => Promise<MCGetListItemMetaResponse>;

  unstable_getObjectMeta: <Request extends MCGetObjectMetaRequest<Endpoints>>(
    request: Request
  ) => Promise<MCGetObjectMetaResponse>;

  unstable_updateStatus: <Request extends MCUpdateStatusRequest<Endpoints>>(
    request: Request
  ) => Promise<void>;

  unstable_getMedia: <Request extends MCGetMediaRequest>(
    request: Request
  ) => Promise<MCGetMediaResponse<Request>>;
};
