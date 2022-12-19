const valueHandler = (value: any) => {
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
};

export const parser = (queries: object): string => {
  const stringified = Object.entries(queries).map(
    ([key, value]) => `${key}=${valueHandler(value)}`
  );
  return stringified.join("&");
};
