export type KV = Record<string, unknown>;

export type ArrayType<T extends any[]> = T extends (infer U)[] ? U : never;

type DeleteOneItem<Array extends any[]> = Array extends [any, ...infer Rest]
  ? Rest
  : never;

type ArrayLength<Array extends any[]> = Array extends { length: infer Length }
  ? Length
  : never;

type NumberToTuple<
  N extends number,
  Array extends any[] = []
> = ArrayLength<Array> extends N ? Array : NumberToTuple<N, [0, ...Array]>;

export type DecrementNum<N extends number> = ArrayLength<
  DeleteOneItem<NumberToTuple<N>>
>;

export type Fetch = typeof fetch;

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
