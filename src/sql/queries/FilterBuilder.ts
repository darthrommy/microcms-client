import { LiteralUnion } from "../../types";

export default class FilterBuilder<
  T,
  K extends LiteralUnion<string & keyof T, string> = LiteralUnion<
    string & keyof T,
    string
  >
> {
  private condition(field: string, operator: string, value?: string) {
    return `${field}[${operator}]${value ?? ""}`;
  }

  /**
   * Perform `equals` filter.
   * @param field - any key of endpoint type
   * @param value - value of the filter
   */
  equals(field: K, value: string) {
    return this.condition(field, "equals", value);
  }

  /**
   * Perform `not_equals` filter.
   * @param field - any key of endpoint type
   * @param value - value of the filter
   */
  notEquals(field: K, value: string) {
    return this.condition(field, "not_equals", value);
  }

  /**
   * Perform `contains` filter.
   * @param field - any key of endpoint type
   * @param value - value of the filter
   */
  contains(field: K, value: string) {
    return this.condition(field, "contains", value);
  }

  /**
   * Perform `not_contains` filter.
   * @param field - any key of endpoint type
   * @param value - value of the filter
   */
  notContains(field: K, value: string) {
    return this.condition(field, "not_contains", value);
  }

  /**
   * Perform `less_than` filter.
   * @param field - any key of endpoint type
   * @param value - value of the filter
   */
  lessThan(field: K, value: string) {
    return this.condition(field, "less_than", value);
  }

  /**
   * Perform `greater_than` filter.
   * @param field - any key of endpoint type
   * @param value - value of the filter
   */
  greaterThan(field: K, value: string) {
    return this.condition(field, "greater_than", value);
  }

  /**
   * Perform `exists` filter.
   * @param field - any key of endpoint type
   */
  exists(field: K) {
    return this.condition(field, "exists");
  }

  /**
   * Perform `not_exists` filter.
   * @param field - any key of endpoint type
   */
  notExists(field: K) {
    return this.condition(field, "not_exists");
  }

  /**
   * Perform `begins_with` filter.
   * @param field - any key of endpoint type
   * @param value - value of the filter
   */
  beginsWith(field: K, value: string) {
    return this.condition(field, "begins_with", value);
  }

  /**
   * Perform `and` operator.
   * @param conditions - This can be `string` values or even ones among methods in this class.
   */
  and(condition1: string, condition2: string, ...conditions: string[]) {
    return `${condition1}[and]${condition2}${
      conditions.at(0) ? "[and]" : ""
    }${conditions.join("[and]")}`;
  }

  /**
   * Perform `or` operator.
   * @param conditions - This can be `string` values or even ones among methods in this class.
   */
  or(condition1: string, condition2: string, ...conditions: string[]) {
    return `(${condition1}[or]${condition2}${
      conditions.at(0) ? "[or]" : ""
    }${conditions.join("[or]")})`;
  }
}
