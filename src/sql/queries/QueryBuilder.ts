import {
  ArrayType,
  DepthNumber,
  MCListResponseBase,
  ResolveDepthResponse,
} from "../../types";
import { QueryConfig } from "../types/client";
import TransformBuilder from "./TransformBuilder";

/**
 * **WARNING: DO NOT CALL FROM OTHER THAN GET-CONTENT API**
 */
export default class QueryBuilder<Schema extends "single" | "list", T> {
  constructor(private config: QueryConfig) {}

  /**
   * Set `fields` and `depth` query.
   * @param options - `fields` and `depth` query
   * @example
   * "*" // no config
   * { fields?: (keyof EndpointType); depth?: 1 | 2 | 3 } // with config
   */
  select<
    Fields extends (string & keyof T)[],
    Keys extends ArrayType<Fields>,
    Picked extends Pick<T, Keys>,
    Depth extends DepthNumber,
    NewT extends ResolveDepthResponse<Picked, Depth>
  >(options: {
    fields?: Fields;
    depth?: Depth;
  }): TransformBuilder<
    NewT,
    Schema extends "single" ? NewT : { contents: NewT[] } & MCListResponseBase
  >;
  select<NewT extends ResolveDepthResponse<T>>(
    options: "*"
  ): TransformBuilder<
    NewT,
    Schema extends "single" ? NewT : { contents: NewT[] } & MCListResponseBase
  >;
  select<Fields extends (string & keyof T)[], Depth extends DepthNumber>(
    options: "*" | { fields?: Fields; depth?: Depth }
  ) {
    if (options === "*") {
      // do nothing
    } else {
      if (options.fields) {
        this.config.url.searchParams.append("fields", options.fields.join(","));
      }

      if (options.depth) {
        this.config.url.searchParams.append("depth", options.depth.toString());
      }
    }

    return new TransformBuilder({
      ...this.config,
    });
  }
}
