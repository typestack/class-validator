import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from './ValidateBy';

export const IS_READONLY = 'isReadOnly';

/**
 * Checks if given value is undefined.
 */
export function isReadOnly(value: unknown): boolean {
  return value === undefined;
}

/**
 * Checks if given value is undefined.
 */
export function IsReadOnly(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_READONLY,
      validator: {
        validate: (value, args): boolean => isReadOnly(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property is readonly and value must be undefined', validationOptions),
      },
    },
    validationOptions
  );
}
