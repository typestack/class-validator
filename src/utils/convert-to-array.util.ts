/**
 * Convert Map, Set to Array
 */
export function convertToArray<T>(val: Array<T> | Set<T> | Map<any, T>): Array<T> {
  if (val instanceof Map) {
    return Array.from(val.values());
  }
  return Array.isArray(val) ? val : Array.from(val);
}
