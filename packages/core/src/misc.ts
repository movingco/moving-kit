/**
 * Applies a function to a list of null/undefined values, unwrapping the null/undefined value or passing it through.
 */
export const mapN = <T extends unknown[], U>(
  fn: (
    ...a: {
      [K in keyof T]: NonNullable<T[K]>;
    }
  ) => U,
  ...args: T
): U | null | undefined => {
  if (!args.every((arg) => arg !== undefined)) {
    return undefined;
  }
  if (!args.every((arg) => arg !== null)) {
    return null;
  }
  return fn(
    ...(args as {
      [K in keyof T]: NonNullable<T[K]>;
    })
  );
};
