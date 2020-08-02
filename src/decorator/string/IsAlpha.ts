import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isAlphaValidator from 'validator/es/lib/isAlpha';
import ValidatorJS from 'validator';

export const IS_ALPHA = 'isAlpha';

/**
 * Checks if the string contains only letters (a-zA-Z).
 * If given value is not a string, then it returns false.
 */
export function isAlpha(value: unknown, locale?: ValidatorJS.AlphaLocale): boolean {
  return typeof value === 'string' && isAlphaValidator(value, locale);
}

/**
 * Checks if the string contains only letters (a-zA-Z).
 * If given value is not a string, then it returns false.
 */
export function IsAlpha(locale?: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ALPHA,
      constraints: [locale],
      validator: {
        validate: (value, args): boolean => isAlpha(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must contain only letters (a-zA-Z)',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
