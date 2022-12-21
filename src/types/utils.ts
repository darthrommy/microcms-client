export type KV = Record<string, unknown>;

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
