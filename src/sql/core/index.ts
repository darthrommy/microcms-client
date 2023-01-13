import { Fetch, Method } from "../../types";
import { CoreBuilderConfig } from "../types/client";

export default abstract class CoreBuilder<Result>
  implements PromiseLike<Result>
{
  protected method: Method;
  protected url: URL;
  protected headers: Record<string, string>;
  protected body?: unknown;
  protected fetch: Fetch;

  constructor(init: CoreBuilderConfig) {
    this.method = init.method;
    this.url = init.url;
    this.headers = init.headers;
    this.body = init.body;

    if (init.fetch) {
      this.fetch = init.fetch;
    } else {
      this.fetch = fetch;
    }
  }

  then<Result1 = Result, Result2 = never>(
    onfulfilled?:
      | ((value: Result) => Result1 | PromiseLike<Result1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: unknown) => Result2 | PromiseLike<Result2>)
      | null
      | undefined
  ): PromiseLike<Result1 | Result2> {
    if (this.method !== "GET") {
      this.headers["Content-Type"] = "application/json";
    }

    const _fetch = this.fetch;
    const result = _fetch(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
    }).then(async (res) => {
      let data = undefined;

      if (res.ok) {
        if (this.method !== "DELETE") {
          data = await res.json();
        }
      } else {
        const error = await res.json();
        throw error;
      }

      return data;
    });
    return result.then(onfulfilled, onrejected);
  }
}
