import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isIsinValidator from 'validator/lib/isISIN';

export const IS_ISIN = 'isIsin';

/**
 * Checks if the string is an ISIN (stock/security identifier).
 * If given value is not a string, then it returns false.
 */
export function isISIN(value: unknown): boolean {
  return typeof value === 'string' && isIsinValidator(value);
}

/**
 * Checks if the string is an ISIN (stock/security identifier).
 * If given value is not a string, then it returns false.
 */
export function IsISIN(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ISIN,
      validator: {
        validate: (value, args): boolean => isISIN(value),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be an ISIN (stock/security identifier)',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
