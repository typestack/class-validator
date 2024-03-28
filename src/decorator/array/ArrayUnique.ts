import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const ARRAY_UNIQUE = 'arrayUnique';
export type ArrayUniqueIdentifier<T = any> = (o: T) => any;

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 * If null or undefined is given then this function returns false.
 */
export function arrayUnique(array: unknown[], identifier?: ArrayUniqueIdentifier): boolean {
  if (!Array.isArray(array)) return false;

  if (identifier) {
    array = array.flatMap(o => (o != null ? identifier(o) : o));
  }

  const uniqueItems = array.filter((a, b, c) => c.indexOf(a) === b);
  return array.length === uniqueItems.length;
}

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 * If null or undefined is given then this function returns false.
 */
export function ArrayUnique<T = any>(
  identifierOrOptions?: ArrayUniqueIdentifier<T> | ValidationOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  const identifier = typeof identifierOrOptions === 'function' ? identifierOrOptions : undefined;
  const options = typeof identifierOrOptions !== 'function' ? identifierOrOptions : validationOptions;

  return ValidateBy(
    {
      name: ARRAY_UNIQUE,
      validator: {
        validate: (value, args): boolean => arrayUnique(value, identifier),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + "All $property's elements must be unique", options),
      },
    },
    options
  );
}
