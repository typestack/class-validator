import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isIBANValidator from 'validator/lib/isIBAN';
import { IsIBANOptions } from 'validator/lib/isIBAN';

export const IS_IBAN = 'isIBAN';

/**
 * Check if a string is a IBAN (International Bank Account Number).
 * If given value is not a string, then it returns false.
 */
export function isIBAN(value: unknown, options?: IsIBANOptions): boolean {
  return typeof value === 'string' && isIBANValidator(value, options);
}

/**
 * Check if a string is a IBAN (International Bank Account Number).
 * If given value is not a string, then it returns false.
 */
export function IsIBAN(options?: IsIBANOptions, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_IBAN,
      constraints: [options],
      validator: {
        validate: (value, args): boolean => isIBAN(value, args?.constraints[0]),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be an IBAN', validationOptions),
      },
    },
    validationOptions
  );
}
