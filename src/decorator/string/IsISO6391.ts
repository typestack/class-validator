import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isISO6391 from 'validator/lib/isISO6391';

export const IS_ISO6391 = 'isISO6391';

/**
 * Checks if the string is an ISO 639-1 (the country language code).
 * If given value is not a string, then it returns false.
 */
export function isIso6391(value: unknown): boolean {
  return typeof value === 'string' && isISO6391(value);
}

/**
 * Checks if the string is an ISIN (stock/security identifier).
 * If given value is not a string, then it returns false.
 */
export function IsISO6391(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ISO6391,
      validator: {
        validate: (value, args): boolean => isIso6391(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be an ISO 639-1 (the country language code)',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
