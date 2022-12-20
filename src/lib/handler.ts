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

const thrower = async (res: Response) => {
  if (!res.ok) {
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
      await thrower(res);
      return await res.json();
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
      await thrower(res);
      return await res.json();
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
      await thrower(res);
      return await res.json();
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
      await thrower(res);
      return await res.json();
    }
    case "DELETE": {
      const stringified = parser(props.queries ?? {});
      const res = await fetcher(
        `${url}${stringified ? `?${stringified}` : ""}`,
        { method, headers },
        customFetch
      );
      await thrower(res);
      return;
    }
  }
};
