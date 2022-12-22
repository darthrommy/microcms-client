import { Fetch } from "../types/base";
import { parser } from "./parser";

const fetcher = async (
  input: string,
  init: RequestInit,
  customFetch: Fetch = fetch
) => {
  return await customFetch(input, init);
};

const safeParse = (json: any) => {
  try {
    return JSON.parse(json);
  } catch {
    return JSON.parse(JSON.stringify(json));
  }
};

type RequestBase = {
  url: string;
  apiKey: string;
  customFetch: Fetch | undefined;
};

type FetchHandler = (
  args: RequestBase &
    (
      | {
          method: "GET" | "DELETE";
          queries?: object;
        }
      | {
          method: "POST" | "PUT";
          body: any;
          queries?: object;
        }
      | {
          method: "PATCH";
          body: object;
        }
    )
) => Promise<any>;

const thrower = (ok: boolean, status: number, body: any) => {
  if (!ok) {
    throw new Error(
      `MicroCMS fetch API Error\n  ${status}: ${body["message"]}`
    );
  }
};

export const fetchHandler: FetchHandler = async (props) => {
  const { method, url, apiKey, customFetch } = props;
  const apiKeyHeader = {
    "x-microcms-api-key": apiKey,
  };
  const contentType = {
    "content-type": "application/json",
  };

  switch (method) {
    case "GET": {
      const stringified = parser(props.queries ?? {});
      const res = await fetcher(
        `${url}${stringified ? `?${stringified}` : ""}`,
        { method, headers: apiKeyHeader },
        customFetch
      );
      const json = safeParse(await res.json());
      if (!res.ok) {
        thrower(res.ok, res.status, json);
      }
      return json;
    }
    case "POST": {
      const stringified = parser(props.queries ?? {});
      const res = await fetcher(
        `${url}${stringified ? `?${stringified}` : ""}`,
        {
          headers: { ...apiKeyHeader, ...contentType },
          method,
          body: JSON.stringify(props.body),
        },
        customFetch
      );
      const json = safeParse(await res.json());
      if (!res.ok) {
        thrower(res.ok, res.status, json);
      }
      return json;
    }
    case "PUT": {
      const stringified = parser(props.queries ?? {});
      const res = await fetcher(
        `${url}${stringified ? `?${stringified}` : ""}`,
        {
          headers: { ...apiKeyHeader, ...contentType },
          method,
          body: JSON.stringify(props.body),
        },
        customFetch
      );
      const json = safeParse(await res.json());
      if (!res.ok) {
        thrower(res.ok, res.status, json);
      }
      return json;
    }
    case "PATCH": {
      const res = await fetcher(
        url,
        {
          headers: { ...apiKeyHeader, ...contentType },
          method,
          body: JSON.stringify(props.body),
        },
        customFetch
      );
      const json = safeParse(await res.json());
      if (!res.ok) {
        thrower(res.ok, res.status, json);
      }
      return json;
    }
    case "DELETE": {
      const stringified = parser(props.queries ?? {});
      const res = await fetcher(
        `${url}${stringified ? `?${stringified}` : ""}`,
        { method, headers: apiKeyHeader },
        customFetch
      );
      if (!res.ok) {
        const json = await res.json();
        thrower(res.ok, res.status, json);
      }
      return;
    }
  }
};
