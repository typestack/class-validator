import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isISO31661NumericValidator from 'validator/lib/isISO31661Numeric';

export const IS_ISO31661_NUMERIC = 'isISO31661Numeric';

/**
 * Check if the string is a valid [ISO 3166-1 numeric](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) officially assigned country code.
 */
export function isISO31661Numeric(value: unknown): boolean {
  return typeof value === 'string' && isISO31661NumericValidator(value);
}

/**
 * Check if the string is a valid [ISO 3166-1 numeric](https://en.wikipedia.org/wiki/ISO_3166-1_numeric) officially assigned country code.
 */
export function IsISO31661Numeric(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ISO31661_NUMERIC,
      validator: {
        validate: (value, args): boolean => isISO31661Numeric(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid ISO 3166-1 numeric country code',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
