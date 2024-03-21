import { isObjectLiteral } from './is-object-literal.util';

/**
 * Convert Map, Set to Array
 */
export function convertToArray<T>(val: Array<T> | Set<T> | Map<any, T> | Record<keyof any, T>): Array<T> {
  if (val instanceof Map) {
    return Array.from(val.values());
  }

  if (isObjectLiteral(val)) {
    return Object.values(val);
  }

  return Array.isArray(val) ? val : Array.from(val);
}
