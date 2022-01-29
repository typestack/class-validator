import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isAlphanumericValidator from 'validator/lib/isAlphanumeric';
import ValidatorJS from 'validator';

export const IS_ALPHANUMERIC = 'isAlphanumeric';

/**
 * Checks if the string contains only letters and numbers.
 * If given value is not a string, then it returns false.
 */
export function isAlphanumeric(value: unknown, locale?: ValidatorJS.AlphanumericLocale, options?: ValidatorJS.IsAlphanumericOptions): boolean {
  return typeof value === 'string' && isAlphanumericValidator(value, locale, options);
}

/**
 * Checks if the string contains only letters and numbers.
 * If given value is not a string, then it returns false.
 */
export function IsAlphanumeric(locale?: string, validationOptions?: ValidationOptions, options?: ValidatorJS.IsAlphanumericOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ALPHANUMERIC,
      constraints: [locale, options],
      validator: {
        validate: (value, args): boolean => isAlphanumeric(value, args.constraints[0], args.constraints[1]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must contain only letters and numbers',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
