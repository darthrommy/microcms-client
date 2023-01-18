import { API_VERSION, BASE_DOMAIN, BASE_MNG_DOMAIN } from "../../lib/static";
import { Fetch } from "../../types";
import { EndpointConfig } from "../types/client";

export default abstract class EndpointBase {
  protected headers: Record<string, string>;
  /** @example "https://{service}.microcms.io/api/v1/{endpoint}" */
  protected contentsApi: `https://${string}.${typeof BASE_DOMAIN}/api/${typeof API_VERSION}/${string}`;
  /** @example "https://{service}.microcms-management.io/api/v1/contents/{endpoint}" */
  protected managementApi: `https://${string}.${typeof BASE_MNG_DOMAIN}/api/${typeof API_VERSION}/contents/${string}`;
  protected fetch: Fetch;

  constructor({ serviceDomain, apiKey, endpoint, fetch }: EndpointConfig) {
    this.contentsApi = `https://${serviceDomain}.${BASE_DOMAIN}/api/${API_VERSION}/${endpoint}`;
    this.managementApi = `https://${serviceDomain}.${BASE_MNG_DOMAIN}/api/${API_VERSION}/contents/${endpoint}`;
    this.headers = {
      "x-microcms-api-key": apiKey,
    };
    this.fetch = fetch;
  }
}
