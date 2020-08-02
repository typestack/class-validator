import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_STRING = 'isString';

/**
 * Checks if a given value is a real string.
 */
export function isString(value: unknown): value is string {
  return value instanceof String || typeof value === 'string';
}

/**
 * Checks if a given value is a real string.
 */
export function IsString(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_STRING,
      validator: {
        validate: (value, args): boolean => isString(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a string', validationOptions),
      },
    },
    validationOptions
  );
}
