type Parser = (queries: object) => string;

export const parser: Parser = queries => {
  const stringified = Object.entries(queries).map(
    ([key, value]) =>
      `${key}=${(() => {
        switch (typeof value) {
          case "string": {
            return value;
          }
          case "number": {
            return `${value}`;
          }
          case "object": {
            if (Array.isArray(value)) {
              return value.join(",");
            } else {
              return parser(value);
            }
          }
        }
      })()}`
  );
  return stringified.join("&");
};
