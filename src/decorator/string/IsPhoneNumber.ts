import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export const IS_PHONE_NUMBER = 'isPhoneNumber';

/**
 * Checks if the string is a valid phone number. To successfully validate any phone number the text must include
 * the intl. calling code, if the calling code wont be provided then the region must be set.
 *
 * @param value the potential phone number string to test
 * @param region 2 characters uppercase country code (e.g. DE, US, CH) for country specific validation.
 * If text doesn't start with the international calling code (e.g. +41), then you must set this parameter.
 */
export function isPhoneNumber(value: string, region?: CountryCode): boolean {
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
 * Checks if the string is a valid phone number. To successfully validate any phone number the text must include
 * the intl. calling code, if the calling code wont be provided then the region must be set.
 *
 * @param region 2 characters uppercase country code (e.g. DE, US, CH) for country specific validation.
 * If text doesn't start with the international calling code (e.g. +41), then you must set this parameter.
 */
export function IsPhoneNumber(region?: CountryCode, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_PHONE_NUMBER,
      constraints: [region],
      validator: {
        validate: (value, args): boolean => isPhoneNumber(value, args?.constraints[0]),
        defaultMessage: buildMessage(
          eachPrefix => eachPrefix + '$property must be a valid phone number',
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
