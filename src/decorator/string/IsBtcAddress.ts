import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import isBtcAddressValidator from 'validator/es/lib/isBtcAddress';

export const IS_BTC_ADDRESS = 'isBtcAddress';

/**
 * Check if the string is a valid BTC address.
 * If given value is not a string, then it returns false.
 */
export function isBtcAddress(value: unknown): boolean {
  return typeof value === 'string' && isBtcAddressValidator(value);
}

/**
 * Check if the string is a valid BTC address.
 * If given value is not a string, then it returns false.
 */
export function IsBtcAddress(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_BTC_ADDRESS,
      validator: {
        validate: (value, args): boolean => isBtcAddress(value),
        defaultMessage: buildMessage(eachPrefix => eachPrefix + '$property must be a BTC address', validationOptions),
      },
    },
    validationOptions
  );
}
