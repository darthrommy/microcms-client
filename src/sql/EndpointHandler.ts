import { API_VERSION, BASE_MNG_DOMAIN } from "../lib/static";
import {
  ClientEndpoints,
  MCContentId,
  MCImage,
  MCListResponseBase,
} from "../types";
import ListEndpoint from "./clients/ListEndpoint";
import ObjectEndpoint from "./clients/ObjectEndpoint";
import TransformBuilder from "./queries/TransformBuilder";
import { EndpointHandlerConfig } from "./types/client";

export default class EndpointHandler<Endpoints extends ClientEndpoints = any> {
  constructor(private config: EndpointHandlerConfig) {
    if (!config.serviceDomain) throw new Error("serviceDomain is required");
    if (!config.apiKey) throw new Error("apiKey is required");
  }

  /**
   * Specifies list-format endpoint name.
   * @param endpoint - endpoint name
   */
  list<
    EndpointName extends string & keyof Endpoints["list"],
    EndpointType extends Endpoints["list"][EndpointName]
  >(
    endpoint: EndpointName
  ): ListEndpoint<Endpoints, EndpointName, EndpointType> {
    return new ListEndpoint({
      endpoint,
      ...this.config,
    });
  }

  /**
   * Specifies object-format endpoint name.
   * @param endpoint - endpoint name
   */
  object<
    EndpointName extends string & keyof Endpoints["object"],
    EndpointType extends Endpoints["object"][EndpointName]
  >(
    endpoint: EndpointName
  ): ObjectEndpoint<Endpoints, EndpointName, EndpointType> {
    return new ObjectEndpoint({
      endpoint,
      ...this.config,
    });
  }

  /**
   * Retrieves media files from the provided `serviceDomain`.
   */
  media(): TransformBuilder<
    never,
    { media: (MCImage & MCContentId)[] } & MCListResponseBase
  > {
    return new TransformBuilder({
      method: "GET",
      url: new URL(
        `https://${this.config.serviceDomain}.${BASE_MNG_DOMAIN}/api/${API_VERSION}/media`
      ),
      fetch: this.config.fetch,
      headers: {
        "x-microcms-api-key": this.config.apiKey,
      },
    });
  }
}
