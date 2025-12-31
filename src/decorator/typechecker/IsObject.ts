import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_OBJECT = 'isObject';

/**
 * Options to be passed to IsObject decorator.
 */
export interface IsObjectOptions {
  excludeFunctions?: boolean;
}

/**
 * Checks if the value is valid Object.
 * Returns false if the value is not an object.
 */
export function isObject<T = object>(value: unknown, options: IsObjectOptions = {}): value is T {
  return (
    value != null &&
    (typeof value === 'object' || (typeof value === 'function' && !options.excludeFunctions)) &&
    !Array.isArray(value)
  );
}

/**
 * Checks if the value is valid Object.
 * Returns false if the value is not an object.
 */
export function IsObject(options: IsObjectOptions = {}, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_OBJECT,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isObject(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be an object', validationOptions),
      },
    },
    validationOptions
  );
}
