## `@darthrommy/microcms-client`

**WARNING:** This is an **UNOFFICIAL** microCMS client library based on the [`microcms-ts-sdk`](https://github.com/tsuki-lab/microcms-ts-sdk) types.

The APIs are almost the same as that of [`micrcms-js-sdk`](https://github.com/microcmsio/microcms-js-sdk), but a few things are different.

### `getListDetails`→`getListItem`

I found the name `getListDetails` a bit confusing, so I renamed it to `getListItem`.

### No `get` API

The `get` API is omitted in this library, because more specific APIs(`getList`, `getObject`, `getListItem`) exist.

### Changed `ResolveDepthResponse` type definition

The original `ResolveDepthResponse` definition is:

```ts
type ResolveDepthResponse<T, Depth extends number = 1> = MicroCMSListContent & {
  [K in keyof T]: T[K] extends infer Prop
    ? Prop extends MicroCMSRelation<infer R>
      ? Depth extends 0
        ? MicroCMSContentId
        : ResolveDepthResponse<NonNullable<R>, DecrementNum<Depth>>
      : Prop extends MicroCMSRelation<infer R>[]
      ? Depth extends 0
        ? MicroCMSContentId[]
        : ResolveDepthResponse<NonNullable<R>, DecrementNum<Depth>>[]
      : Prop
    : never;
};
```

I really respect sir [tsuki-lab](https://github.com/tsuki-lab) who wrote this beautiful type.

However, there is one point that I do not like.

```ts
MicroCMSListContent & {
  [K in keyof T]: T[K]...
}
```

With this `MicroCMSListContent &`, the return type inference looks like:

```ts
const { contents } = await client.getList({
  endpoint: "some-endpoint",
  queries: { fields: ["name"] }, // only need "name" property
});

typeof contents: {
  name: string;
  publishedAt: string;    // actually does not exists
  createdAt: string;      // this
  revisedAt?: string;     // also this
  updatedAt?: string;     // and this too
}[]

```

This is different from actual return type:

```ts
typeof contents: { name: string; }[];
```

So I modified this type to:

```diff
+ type ResolveDepthResponse<ContentType, Depth extends number = 1> = {
- type ResolveDepthResponse<T, Depth extends number = 1> = MicroCMSListContent & {
    [K in keyof ContentType]: ContentType[K] extends infer Props
      ? Props extends MCRelation<infer Child>
        ? Depth extends 0
          ? MCContentId
          : ResolveDepthResponse<Child, DecrementNum<Depth>>
        : Props extends MCRelation<infer Child>[]
        ? Depth extends 0
          ? MCContentId[]
          : ResolveDepthResponse<Child, DecrementNum<Depth>>[]
        : Props
     : never;
};
```