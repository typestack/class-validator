import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

export const IS_Safe_INT = 'isSafeInt';

/**
 * Checks if value is an safe integer.
 */
export function isSafeInt(val: unknown): val is Number {
  return typeof val === 'number' && Number.isSafeInteger(val);
}

/**
 * Checks if value is an safe integer.
 */
export function IsSafeInt(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_Safe_INT,
      validator: {
        validate: (value, args): boolean => isSafeInt(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be an safe integer number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
