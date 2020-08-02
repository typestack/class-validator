import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
/**
 * The libphonenumber-js is shipped with TS typings however they are not exposed
 * on the /es6 entry-point we need to use to build our own umd version. So we
 * ignore the import warning here. Eventually we should ask upstream to bundle
 * typings into the es6 folder as well.
 */
// @ts-ignore
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export const IS_PHONE_NUMBER = 'isPhoneNumber';

/**
 * Checks if the string is a valid phone number.
 * @param value the potential phone number string to test
 * @param {string} region 2 characters uppercase country code (e.g. DE, US, CH).
 * If users must enter the intl. prefix (e.g. +41), then you may pass "ZZ" or null as region.
 */
export function isPhoneNumber(value: string, region: CountryCode | undefined): boolean {
  try {
    const phoneNum = parsePhoneNumberFromString(value, region);
    const result = phoneNum?.isValid();
    return !!result;
  } catch (error) {
    // logging?
    return false;
  }
}

/**
 * Checks if the string is a valid phone number.
 * @param region 2 characters uppercase country code (e.g. DE, US, CH).
 * If users must enter the intl. prefix (e.g. +41), then you may pass "ZZ" or null as region.
 */
export function IsPhoneNumber(
  region: CountryCode | undefined,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_PHONE_NUMBER,
      constraints: [region],
      validator: {
        validate: (value, args): boolean => isPhoneNumber(value, args.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid phone number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
