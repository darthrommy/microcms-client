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
  MCUpdateListRequest,
  MCUpdateObjectRequest,
  WriteResponse,
} from "./contents";
import {
  MCGetListItemMetaRequest,
  MCGetListItemMetaResponse,
  MCGetListMetaRequest,
  MCGetListMetaResponse,
  MCGetMediaQueries,
  MCGetMediaResponse,
  MCGetObjectMetaRequest,
  MCGetObjectMetaResponse,
  MCSetObjectStatusRequest,
  MCUpdateStatusRequest,
} from "./management";

/** `createClient` type */
export type MCClient = <Endpoints extends ClientEndpoints>(args: {
  serviceDomain: string;
  apiKey: string;
  customFetch?: Fetch;
}) => {
  list: {
    /** Contents API: equivalent to `GET /api/v1/{endpoint}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/contents-api/list-get
     */
    get: <Request extends MCGetListRequest<Endpoints>>(
      request: Request
    ) => Promise<MCGetListResponse<Endpoints, Request>>;

    /** Contents API: equivalent to `GET /api/v1/{endpoint}/{contendId}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/contents-api/list-item
     */
    item: <Request extends MCGetListItemRequest<Endpoints>>(
      request: Request
    ) => Promise<MCGetListItemResponse<Endpoints, Request>>;

    /** Contents API: equivalent to `POST /api/v1/{endpoint}` or `PUT /api/v1/{endpoint}/{contentId}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/contents-api/list-create
     */
    create: <Request extends MCCreateRequest<Endpoints>>(
      request: Request
    ) => Promise<WriteResponse>;

    /** Contents API: equivalent to `PATCH /api/v1/{endpoint}/{contentId}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/contents-api/list-update
     */
    update: <Request extends MCUpdateListRequest<Endpoints>>(
      request: Request
    ) => Promise<WriteResponse>;

    /** Contents API: equivalent to `DELETE /api/v1/{endpoint}/{contentId}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/contents-api/list-delete
     */
    delete: <Request extends MCDeleteRequest<Endpoints>>(
      request: Request
    ) => Promise<void>;

    /** Management API: equivalent to `GET /api/v1/contents/{endpoint}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/management-api/list-meta
     */
    meta: <Request extends MCGetListMetaRequest<Endpoints>>(
      request: Request
    ) => Promise<MCGetListMetaResponse>;

    /** Management API: equivalent to `GET /api/v1/contents/{endpoint}/{contentId}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/management-api/list-itemmeta
     */
    itemMeta: <Request extends MCGetListItemMetaRequest<Endpoints>>(
      request: Request
    ) => Promise<MCGetListItemMetaResponse>;

    /** Management API: equivalent to `PATCH /api/v1/contents/{endpoint}/{contentId}/status`.
     * @see https://rommy-docs.pages.dev/docs/microcms/management-api/list-setstatus
     */
    setStatus: <Request extends MCUpdateStatusRequest<Endpoints>>(
      request: Request
    ) => Promise<void>;
  };
  object: {
    /** Contents API: equivalent to `GET /api/v1/{endpoint}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/contents-api/object-get
     */
    get: <Request extends MCGetObjectRequest<Endpoints>>(
      request: Request
    ) => Promise<MCGetObjectResponse<Endpoints, Request>>;

    /** Contents API: equivalent to `PATCH /api/v1/{endpoint}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/contents-api/object-update
     */
    update: <Request extends MCUpdateObjectRequest<Endpoints>>(
      request: Request
    ) => Promise<WriteResponse>;

    /** Management API: equivalent to `GET /api/v1/contents/{endpoint}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/management-api/object-meta
     */
    meta: <Request extends MCGetObjectMetaRequest<Endpoints>>(
      request: Request
    ) => Promise<MCGetObjectMetaResponse>;

    /** Management API: equivalent to `PATCH /api/v1/contents/{endpoint}/{contentId}`.
     * @see https://rommy-docs.pages.dev/docs/microcms/management-api/object-status
     */
    setStatus: <Request extends MCSetObjectStatusRequest<Endpoints>>(
      request: Request
    ) => Promise<void>;
  };

  /** Management API: equivalent to `GET /api/v1/media`.
   * @see https://rommy-docs.pages.dev/docs/microcms/management-api/media
   */
  media: <Queries extends MCGetMediaQueries>(
    queries?: Queries
  ) => Promise<MCGetMediaResponse<Queries>>;
};
