import { Fetch } from "./base";
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
import { KV } from "./utils";

/** A template type to define types of each endpoints. See https://github.com/tsuki-lab/microcms-ts-sdk#type-safe-usage */
export type ClientEndpoints = {
  list?: KV;
  object?: KV;
};

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
};
