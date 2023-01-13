import FilterBuilder from "./FilterBuilder";
import CoreBuilder from "../core";

export default class TransformBuilder<T, Result> extends CoreBuilder<Result> {
  /**
   * Specify `draftKey` query. Only effective on `list.get()` and `list.get(id)`.
   * @param key - draft key
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#draftkey
   */
  draftKey(key: string) {
    this.url.searchParams.append("draftKey", key);
    return this;
  }
  /**
   *  Specify `limit` query. Only effective on `list.get()` and `list.meta()`.
   * @param limit - maximum length of contents to be retrieved
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#limit
   */
  limit(limit: number) {
    this.url.searchParams.append("limit", limit.toString());
    return this;
  }
  /**
   * Specify `offset` query. Only effective on `list.get()` and `list.meta()`.
   * @param offset - offset of the first item to be retrieved
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#offset
   */
  offset(offset: number) {
    this.url.searchParams.append("offset", offset.toString());
    return this;
  }

  /**
   * Specify `orders` query. Only effective on `list.get()`.
   * @param orders - order expressions
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#orders
   */
  orders(orders: string) {
    this.url.searchParams.append("orders", orders);
    return this;
  }

  /**
   * Specify `q` query. Only effective on `list.get()`.
   * @param q - any string to search for
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#q
   */
  q(q: string) {
    this.url.searchParams.append("q", q);
    return this;
  }

  /**
   * Specify `ids` query. Only effective on `list.get()`
   * @param ids - one or more ids of items
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#ids
   */
  ids(ids: string | string[]) {
    if (typeof ids === "string") {
      this.url.searchParams.append("ids", ids);
    } else {
      this.url.searchParams.append("ids", ids.join(","));
    }

    return this;
  }

  /**
   * Specify `filters` query. Only effective on `list.get()`, `list.get(id)` and `object.get()`.
   * @param expressions - can be string or filter function.
   * @example (fn) => fn.equals("field", "value")
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#filters
   * @see https://rommy-docs.pages.dev/docs/microcms/sql#filters
   */
  filters(filter: string): this;
  filters(filterFn: (fn: FilterBuilder<T>) => string): this;
  filters(expression: string | ((fn: FilterBuilder<T>) => string)) {
    if (typeof expression === "string") {
      this.url.searchParams.append("filters", expression);
    } else {
      const filter = expression(new FilterBuilder<T>());
      this.url.searchParams.append("filters", filter);
    }

    return this;
  }

  /**
   * Specify `format` query. Only effective on `list.get()`, `list.get(id)` and `object.get()`.
   * @param format - `"html" | "object"`
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#richeditorformat
   */
  richEditorFormat(format: "html" | "object") {
    this.url.searchParams.append("richEditorFormat", format);
    return this;
  }

  /**
   * Shorthand for setting `imageOnly` query to `true`. Only effective on `media()`.
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#imageonly
   */
  imageOnly() {
    this.url.searchParams.append("imageOnly", "true");
    return this;
  }

  /**
   * Shorthand for setting `status` query to `"draft"`. Only effective on `list.create(request)`.
   * @see https://rommy-docs.pages.dev/docs/microcms/gotchas#
   */
  draft() {
    this.url.searchParams.append("status", "draft");
    return this;
  }
}
