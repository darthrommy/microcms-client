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

type Primitive = string | number | boolean | symbol | undefined;

export type LiteralUnion<Literal extends Base, Base extends Primitive> =
  | Literal
  | (Base & { _?: never });

export type ArrayType<T extends any[]> = T extends (infer U)[] ? U : never;
