import { contentType } from "../../lib/static";
import {
  ClientEndpoints,
  MCContentStatus,
  MCMeta,
  MCObjectBase,
} from "../../types";
import NoTransformers from "../queries/NoTransformers";
import TransformBuilder from "../queries/TransformBuilder";
import QueryBuilder from "../queries/QueryBuilder";
import EndpointBase from "./EndpointBase";

export default class ObjectEndpoint<
  Endpoints extends ClientEndpoints = any,
  EndpointName extends string & keyof Endpoints["object"] = string &
    keyof Endpoints["object"],
  EndpointType extends Endpoints["object"][EndpointName] = Endpoints["object"][EndpointName]
> extends EndpointBase {
  /**
   * Performs `GET` API in contents API.
   */
  get(): QueryBuilder<"single", MCObjectBase & EndpointType> {
    return new QueryBuilder({
      method: "GET",
      url: new URL(this.contentsApi),
      headers: this.headers,
      fetch: this.fetch,
    });
  }

  /**
   * Performs `PATCH` API in contents API.
   * @param payload - payload of the update
   */
  update(payload: Partial<EndpointType>): NoTransformers<undefined> {
    return new NoTransformers({
      method: "PATCH",
      url: new URL(this.contentsApi),
      headers: this.headers,
      fetch: this.fetch,
      body: payload,
    });
  }

  /**
   * Performs `GET` API in management API.
   */
  meta(): TransformBuilder<never, MCMeta & MCObjectBase> {
    return new TransformBuilder({
      method: "GET",
      url: new URL(this.managementApi),
      headers: this.headers,
      fetch: this.fetch,
    });
  }

  /**
   * Perform `PATCH` API in management API.
   * @param status - Either `"DRAFT"` or `"PUBLISH"`
   */
  setStatus(status: Exclude<MCContentStatus, "CLOSED">) {
    return new NoTransformers({
      method: "PATCH",
      url: new URL(this.managementApi),
      fetch: this.fetch,
      headers: { ...this.headers, ...contentType },
      body: { status: [status] },
    });
  }
}
