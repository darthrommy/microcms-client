## `@darthrommy/microcms-client`

**WARNING:** This is an **UNOFFICIAL** microCMS client library based on the [`microcms-ts-sdk`](https://github.com/tsuki-lab/microcms-ts-sdk) types.

The APIs are almost the same as that of [`micrcms-js-sdk`](https://github.com/microcmsio/microcms-js-sdk), but a few things are different.

### `getListDetails`→`getListItem`

I found the name `getListDetails` a bit confusing, so I renamed it to `getListItem`.

### No `get` API

The `get` API is omitted in this library, because more specific APIs(`getList`, `getObject`, `getListItem`) exist.