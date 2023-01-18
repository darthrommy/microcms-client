import { ClientEndpoints } from "../types";
import EndpointHandler from "./EndpointHandler";
import { ClientConfig } from "./types/client";

export const createClient = <Endpoints extends ClientEndpoints = any>({
  serviceDomain,
  apiKey,
  customFetch,
}: ClientConfig) => {
  return new EndpointHandler<Endpoints>({
    serviceDomain,
    apiKey,
    fetch: customFetch ?? fetch,
  });
};
