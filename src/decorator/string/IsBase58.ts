import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isBase58Validator from 'validator/lib/isBase58';

export const IS_BASE58 = 'isBase58';

/**
 * Checks if a string is base58 encoded.
 * If given value is not a string, then it returns false.
 */
export function isBase58(value: unknown): boolean {
  return typeof value === 'string' && isBase58Validator(value);
}

/**
 * Checks if a string is base58 encoded.
 * If given value is not a string, then it returns false.
 */
export function IsBase58(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_BASE58,
      validator: {
        validate: (value, args): boolean => isBase58(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be base58 encoded', validationOptions),
      },
    },
    validationOptions
  );
}
