import { Fetch } from "../type-utils";
import { parser } from "./parser";

type Fetcher = (
  input: string,
  init: RequestInit,
  customFetch?: Fetch
) => Promise<Response>;

const fetcher: Fetcher = async (
  input: string,
  init: RequestInit,
  customFetch = fetch
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
          body: object;
          queries?: object;
        }
      | {
          method: "PATCH";
          body: object;
        }
    )
) => Promise<any>;

export const fetchHandler: FetchHandler = async props => {
  const { method, url, apiKey, customFetch } = props;
  const headers = {
    "x-microcms-api-key": apiKey,
  };

  if (method === "GET" || method === "DELETE") {
    const stringified = parser(props.queries ?? {});
    const res = await fetcher(
      `${url}${stringified ? `?${stringified}` : ""}`,
      { method, headers },
      customFetch
    );
    return await res.json();
  } else if (method === "POST" || method === "PUT") {
    const stringified = parser(props.queries ?? {});
    const res = await fetcher(
      `${url}${stringified ? `?${stringified}` : ""}`,
      {
        headers,
        method,
        body: JSON.stringify(props.body),
      },
      customFetch
    );
    return await res.json();
  } else if (method === "PATCH") {
    const res = await fetcher(
      url,
      {
        headers,
        method,
        body: JSON.stringify(props.body),
      },
      customFetch
    );
    return await res.json();
  }
};
