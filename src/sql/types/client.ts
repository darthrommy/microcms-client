import { Fetch, Method } from "../../types";

export type ClientConfig = {
  /** Your service domain
   * @example "xxx" in "https://xxx.microcms.io"
   */
  serviceDomain: string;
  /** Your api key */
  apiKey: string;
  /** Custom fetch implementation */
  customFetch?: Fetch;
};

export type EndpointConfig = Omit<ClientConfig, "customFetch"> & {
  fetch: Fetch;
  endpoint: string;
};

export type EndpointHandlerConfig = Omit<EndpointConfig, "endpoint">;

export type CoreBuilderConfig = {
  url: URL;
  method: Method;
  headers: Record<string, string>;
  fetch: Fetch;
  body?: unknown;
};

export type QueryConfig = Omit<CoreBuilderConfig, "body">;
