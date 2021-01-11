import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_ARRAY = 'isArray';

/**
 * Checks if a given value is an array
 */
export function isArray(value: unknown): boolean {
  return value instanceof Array;
}

/**
 * Checks if a given value is an array
 */
export function IsArray(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ARRAY,
      validator: {
        validate: (value, args): boolean => isArray(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be an array', validationOptions),
      },
    },
    validationOptions
  );
}
