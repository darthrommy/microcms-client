import { API_VERSION, BASE_DOMAIN, BASE_MNG_DOMAIN } from "./lib/static";
import { MCClient } from "./types";
import { fetchHandler } from "./lib/handler";

export const createClient: MCClient = ({
  serviceDomain,
  apiKey,
  customFetch,
}) => {
  const baseUrl = `https://${serviceDomain}.${BASE_DOMAIN}/api/${API_VERSION}`;
  const baseMngUrl = `https://${serviceDomain}.${BASE_MNG_DOMAIN}/api/${API_VERSION}`;
  return {
    list: {
      get: (req) => {
        return fetchHandler({
          url: `${baseUrl}/${req.endpoint}`,
          method: "GET",
          queries: req.queries,
          apiKey,
          customFetch,
        });
      },

      item: (req) => {
        return fetchHandler({
          url: `${baseUrl}/${req.endpoint}/${req.contentId}`,
          method: "GET",
          queries: req.queries,
          apiKey,
          customFetch,
        });
      },

      create: (req) => {
        return fetchHandler({
          url: `${baseUrl}/${req.endpoint}${
            req.contentId ? `/${req.contentId}` : ""
          }`,
          method: req.contentId ? "PUT" : "POST",
          body: req.content,
          queries: req.isDraft ? { status: "draft" } : {},
          apiKey,
          customFetch,
        });
      },

      update: (req) => {
        return fetchHandler({
          url: `${baseUrl}/${req.endpoint}/${req.contentId}`,
          method: "PATCH",
          body: req.content,
          apiKey,
          customFetch,
        });
      },

      delete: (req) => {
        return fetchHandler({
          url: `${baseUrl}/${req.endpoint}/${req.contentId}`,
          method: "DELETE",
          apiKey,
          customFetch,
        });
      },

      meta: (req) => {
        return fetchHandler({
          url: `${baseMngUrl}/contents/${req.endpoint}`,
          method: "GET",
          apiKey,
          customFetch,
        });
      },

      itemMeta: (req) => {
        return fetchHandler({
          url: `${baseMngUrl}/contents/${req.endpoint}/${req.contentId}`,
          method: "GET",
          apiKey,
          customFetch,
        });
      },

      setStatus: (req) => {
        return fetchHandler({
          url: `${baseMngUrl}/contents/${req.endpoint}/${req.contentId}`,
          method: "PATCH",
          body: { status: req.status },
          apiKey,
          customFetch,
        });
      },
    },

    object: {
      get: (req) => {
        return fetchHandler({
          url: `${baseUrl}/${req.endpoint}`,
          method: "GET",
          queries: req.queries,
          apiKey,
          customFetch,
        });
      },

      update: (req) => {
        return fetchHandler({
          url: `${baseUrl}/${req.endpoint}`,
          method: "PATCH",
          body: req.content,
          apiKey,
          customFetch,
        });
      },

      meta: (req) => {
        return fetchHandler({
          url: `${baseMngUrl}/contents/${req.endpoint}`,
          method: "GET",
          apiKey,
          customFetch,
        });
      },

      setStatus: (req) => {
        return fetchHandler({
          url: `${baseMngUrl}/contents/${req.endpoint}`,
          method: "PATCH",
          body: { status: req.status },
          apiKey,
          customFetch,
        });
      },
    },

    media: (req) => {
      return fetchHandler({
        url: `${baseMngUrl}/media`,
        method: "GET",
        queries: req,
        apiKey,
        customFetch,
      });
    },
  };
};
