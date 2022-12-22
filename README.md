# `@darthrommy/microcms-client`

## This is UNOFFICIAL

This is an **UNOFFICIAL** microCMS client library based on the [`microcms-ts-sdk`](https://github.com/tsuki-lab/microcms-ts-sdk) types.

Plus, I am **NOT** a `microcms-js-sdk` maintainer nor a `microcms-ts-sdk` developer.

Being unable to guarantee that the APIs are always compatible with the official ones, I highly recommend you to use the latest [`microcms-js-sdk`](https://github.com/microcmsio/microcms-js-sdk).

## Notes

The APIs are almost the same as that of [`microcms-js-sdk`](https://github.com/microcmsio/microcms-js-sdk), but a few things are different.

### `getListDetails`→`getListItem`

I found the name `getListDetails` a bit confusing, so I renamed it to `getListItem`.

### No `get` API

The `get` API is omitted in this library, because more specific APIs(`getList`, `getObject`, `getListItem`) exist.

### Standard `Fetch` API

While the `microcms-js-sdk` uses `cross-fetch` as the default fetch method, this library uses the standard `fetch()` as the default. However, like the official one, this method can be customized by configuring the `customFetch` option in the `createClient` argument.

```ts
createClient({
  serviceDomain: string;
  apiKey: string;
  customFetch?: typeof fetch
})
```

### Changed `ResolveDepthResponse` type definition

The original `ResolveDepthResponse`(see `microcms-ts-sdk`) definition is:

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

//typeof contents
{
  name: string;
  publishedAt: string;    // actually does not exists
  createdAt: string;      // this
  revisedAt?: string;     // also this
  updatedAt?: string;     // and this too
}[]

```

This is different from actual return type `{ name: string }[]`. So I modified this type to:

```diff
+ type ResolveDepthResponse<ContentType, Depth extends number = 1> = {
- type ResolveDepthResponse<T, Depth extends number = 1> = MicroCMSListContent & {
```

## License

This software contains productions distributed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
