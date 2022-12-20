import { Fetch } from "../type-utils";
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

export const fetchHandler: FetchHandler = async props => {
  const { method, url, apiKey, customFetch } = props;
  const headers = {
    "x-microcms-api-key": apiKey,
  };

  switch (method) {
    case "GET": {
      const stringified = parser(props.queries ?? {});
      const res = await fetcher(
        `${url}${stringified ? `?${stringified}` : ""}`,
        { method, headers },
        customFetch
      );
      return await responseHandler(res);
    }
    case "POST": {
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
      return await responseHandler(res);
    }
    case "PUT": {
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
      return await responseHandler(res);
    }
    case "PATCH": {
      const res = await fetcher(
        url,
        {
          headers,
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
        { method, headers },
        customFetch
      );
      return await responseHandler(res);
    }
  }
};
