export function snakeToCamel(str: string) {
  return str.toLowerCase().replace(/[-_]([a-z])/g, (match, char) => char.toUpperCase());
}
