import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isPostalCodeValidator from 'validator/lib/isPostalCode';
import * as ValidatorJS from 'validator';

export const IS_POSTAL_CODE = 'isPostalCode';

/**
 * Check if the string is a postal code, in the specified locale.
 * If given value is not a string, then it returns false.
 */
export function isPostalCode(value: unknown, locale: 'any' | ValidatorJS.PostalCodeLocale): boolean {
  return typeof value === 'string' && isPostalCodeValidator(value, locale);
}

/**
 * Check if the string is a postal code, in the specified locale.
 * If given value is not a string, then it returns false.
 */
export function IsPostalCode(
  locale?: 'any' | ValidatorJS.PostalCodeLocale,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_POSTAL_CODE,
      constraints: [locale],
      validator: {
        validate: (value, args): boolean => isPostalCode(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a postal code', validationOptions),
      },
    },
    validationOptions
  );
}
