import { contentType } from "../../lib/static";
import {
  ClientEndpoints,
  MCContentStatus,
  MCListItemBase,
  MCListResponseBase,
  MCMeta,
  MCObjectBase,
  WriteResponse,
} from "../../types";
import EndpointBase from "./EndpointBase";
import NoTransformers from "../queries/NoTransformers";
import TransformBuilder from "../queries/TransformBuilder";
import QueryBuilder from "../queries/QueryBuilder";

export default class ListEndpoint<
  Endpoints extends ClientEndpoints = any,
  EndpointName extends string & keyof Endpoints["list"] = string &
    keyof Endpoints["list"],
  EndpointType extends Endpoints["list"][EndpointName] = Endpoints["list"][EndpointName]
> extends EndpointBase {
  /**
   * Performs `GET` *contents** API.
   * @param id - _(optional)_ Specify when getting a single item.
   * @example
   * get()  // will perform GET /api/v1/{endpoint}
   * get(id)  // will perform GET /api/v1/{endpoint}/{id}
   */
  get(): QueryBuilder<"list", MCListItemBase & EndpointType>;
  get(id: string): QueryBuilder<"single", MCObjectBase & EndpointType>;
  get(id?: string) {
    return new QueryBuilder({
      method: "GET",
      url: new URL(`${this.contentsApi}${id ? `/${id}` : ""}`),
      headers: this.headers,
      fetch: this.fetch,
    });
  }

  /**
   * Performs `POST`/`PUT` **contents** API.
   * @param request - configurations of API call
   * @example
   * { payload: EndpointType }  // will perform `POST` API
   * { id: string; payload: EndpointType }  // will perform `PUT` API
   */
  create(request: {
    payload: EndpointType;
  }): TransformBuilder<never, WriteResponse>;
  create(request: {
    id: string;
    payload: EndpointType;
  }): TransformBuilder<never, WriteResponse>;
  create(request: { payload: EndpointType; id?: string }) {
    return new TransformBuilder({
      method: request.id ? "PUT" : "POST",
      url: new URL(`${this.contentsApi}${request.id ? `/${request.id}` : ""}`),
      headers: { ...this.headers, ...contentType },
      fetch: this.fetch,
    });
  }

  /**
   * Performs `PATCH` **contents** API.
   * @param id - id of target item
   * @param payload - payload of update
   */
  update(
    id: string,
    payload: Partial<EndpointType>
  ): NoTransformers<WriteResponse> {
    return new NoTransformers({
      method: "PATCH",
      url: new URL(`${this.contentsApi}/${id}`),
      fetch: this.fetch,
      headers: { ...this.headers, ...contentType },
      body: payload,
    });
  }

  /**
   * Performs `DELETE` **contents** API.
   * @param id - id of target item
   */
  delete(id: string): NoTransformers<undefined> {
    return new NoTransformers({
      method: "DELETE",
      url: new URL(`${this.contentsApi}/${id}`),
      fetch: this.fetch,
      headers: this.headers,
    });
  }

  /**
   * Performs `GET` **management** API.
   * @param id - _(optional)_ Specify when getting a single item
   * @example
   * meta()  // will perform GET /api/v1/contents/{endpoint}
   * meta(id)  // will perform GET /api/v1/contents/{endpoint}/{id}
   */
  meta<Props extends MCMeta & MCListItemBase>(): TransformBuilder<
    never,
    { contents: Props[] } & MCListResponseBase
  >;
  meta<Props extends MCMeta & MCListItemBase>(
    id: string
  ): TransformBuilder<never, Props>;
  meta(id?: string) {
    return new TransformBuilder({
      method: "GET",
      url: new URL(`${this.managementApi}${id ? `/${id}` : ""}`),
      fetch: this.fetch,
      headers: this.headers,
    });
  }

  /**
   * Perform `PATCH` **management** API.
   * @param id - id of target item
   * @param status - status to set (`"DRAFT" | "PUBLISH"`)
   */
  setStatus(id: string, status: Exclude<MCContentStatus, "CLOSED">) {
    return new NoTransformers({
      method: "PATCH",
      url: new URL(`${this.managementApi}/${id}`),
      fetch: this.fetch,
      headers: { ...this.headers, ...contentType },
      body: { status },
    });
  }
}
