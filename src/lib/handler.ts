import { Fetch } from "../types/base";
import { parser } from "./parser";

const fetcher = async (
  input: string,
  init: RequestInit,
  customFetch: Fetch = fetch
) => {
  return await customFetch(input, init);
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

const responseHandler = async (res: Response) => {
  if (res.ok) {
    return await res.json();
  } else {
    const body = await res.json();
    throw new Error(
      `MicroCMS fetch API Error\n  ${res.status}: ${body["message"]}`
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
      return await responseHandler(res);
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
      return await responseHandler(res);
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
      return await responseHandler(res);
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
      return await responseHandler(res);
    }
    case "DELETE": {
      const stringified = parser(props.queries ?? {});
      const res = await fetcher(
        `${url}${stringified ? `?${stringified}` : ""}`,
        { method, headers: apiKeyHeader },
        customFetch
      );
      if (!res.ok) {
        await responseHandler(res);
      }
      return;
    }
  }
};
