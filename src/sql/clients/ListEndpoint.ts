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
   * Performs `GET` API of contents API.
   * @param id - _(optional)_ Specify when getting a single item.
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

  delete(id: string): NoTransformers<undefined> {
    return new NoTransformers({
      method: "DELETE",
      url: new URL(`${this.contentsApi}/${id}`),
      fetch: this.fetch,
      headers: this.headers,
    });
  }

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
