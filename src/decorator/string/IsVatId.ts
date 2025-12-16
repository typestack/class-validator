import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isVatIdValidator from 'validator/lib/isVat';

export const IS_VAT_ID = 'isVat';

/**
 * Checks if the string is a VAT (value-added tax) identification number.
 * If given value is not a string, then it returns false.
 */
export function isVatId(value: unknown, countryCode: string): boolean {
  try {
    const isVatId = typeof value === 'string' && isVatIdValidator(value, countryCode);
    return isVatId;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the string is a VAT (value-added tax) identification number.
 * If given value is not a string, then it returns false.
 */
export function IsVatId(countryCode?: string, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_VAT_ID,
      constraints: [countryCode],
      validator: {
        validate: (value, args): boolean => isVatId(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a VAT ID', validationOptions),
      },
    },
    validationOptions
  );
}
