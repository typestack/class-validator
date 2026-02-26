import { allPhoneNumberTypes, PhoneNumberType } from '../../utils/phone-number-type';
import { ValidationOptions } from '../ValidationOptions';
import { buildMessage, ValidateBy } from '../common/ValidateBy';

/* Changed import to /max for all metadata provided in the library in order to check phone number type
 * since the (default = /min) always returns undefined in the .getType()
 * reference https://www.npmjs.com/package/libphonenumber-js
 */
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js/max';

export const IS_PHONE_NUMBER = 'isPhoneNumber';

/**
 * Checks if the string is a valid phone number. To successfully validate any phone number the text must include
 * the intl. calling code, if the calling code wont be provided then the region must be set.
 *
 * @param value the potential phone number string to test
 * @param region 2 characters uppercase country code (e.g. DE, US, CH) for country specific validation.
 * @param acceptedNumbersTypes list of accepted number types (MOBILE, PAGER, etc...) if not provided then accept all valid numbers.
 * If text doesn't start with the international calling code (e.g. +41), then you must set this parameter.
 */
export function isPhoneNumber(
  value: string,
  region?: CountryCode,
  acceptedNumbersTypes?: Array<PhoneNumberType>
): boolean {
  try {
    // the list of all phone number types that are the output of .getType() method
    let checkedNumberTypes: Array<PhoneNumberType> = allPhoneNumberTypes;

    // Checking if accepted types array is passed to override the default
    if (acceptedNumbersTypes) {
      checkedNumberTypes = acceptedNumbersTypes;
    }

    const phoneNum = parsePhoneNumberFromString(value, region);

    // number must be valid and is one of the phone types the function accepts (ALL TYPES PROVIDED IN phone-number-types.ts)
    const result: boolean = !!phoneNum?.isValid() && !!checkedNumberTypes.some(item => item === phoneNum?.getType());
    return result;
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
 * @param acceptedNumbersTypes list of accepted number types (MOBILE, PAGER, etc...) if not provided then accept all valid phone numbers
 * If text doesn't start with the international calling code (e.g. +41), then you must set this parameter.
 */
export function IsPhoneNumber(
  region?: CountryCode,
  validationOptions?: ValidationOptions,
  acceptedNumbersTypes?: Array<PhoneNumberType>
): PropertyDecorator {
  // the list of all phone number types that are the output of .getType() method
  let checkedNumberTypes: Array<PhoneNumberType> = allPhoneNumberTypes;

  // Checking if accepted types array is passed to override the default
  if (acceptedNumbersTypes) {
    checkedNumberTypes = acceptedNumbersTypes;
  }

  return ValidateBy(
    {
      name: IS_PHONE_NUMBER,
      constraints: [region],
      validator: {
        validate: (value, args): boolean => isPhoneNumber(value, args?.constraints[0], checkedNumberTypes),
        defaultMessage: buildMessage(
          eachPrefix =>
            eachPrefix +
            '$property must be a valid phone number and of the following types: ' +
            checkedNumberTypes.toString(),
          validationOptions
        ),
      },
    },
    validationOptions
  );
}
