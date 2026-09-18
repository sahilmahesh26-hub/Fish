/** Joins class names, dropping falsy values. */
export const cn = (...values: (string | false | null | undefined)[]): string =>
  values.filter(Boolean).join(' ')
