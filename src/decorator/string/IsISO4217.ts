import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isISO4217Validator from 'validator/lib/isISO4217';

export const IS_ISO4217 = 'isISO4217';

/**
 * Check if the string is a valid [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) officially assigned currency code.
 */
export function isISO4217(value: unknown): boolean {
  return typeof value === 'string' && isISO4217Validator(value);
}

/**
 * Check if the string is a valid [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) officially assigned currency code.
 */
export function IsISO4217(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ISO4217,
      validator: {
        validate: (value, args): boolean => isISO4217(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid ISO4217 currency code',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
